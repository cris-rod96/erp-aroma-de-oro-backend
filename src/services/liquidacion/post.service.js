import {
  Liquidacion,
  Persona,
  Usuario,
  Caja,
  Movimiento,
  CuentasPorPagar,
  sq,
  DetalleLiquidacion,
  Producto,
  Retencion,
  Anticipo,
  LiquidacionAnticipo,
  CuentasPorCobrar,
} from '../../libs/db.js'

/**
 * CONVERSOR DINÁMICO DE UNIDADES
 * Triangula cualquier unidad usando Libras como base para precisión agrícola.
 */
const convertirUnidadesBodega = (cantidad, unidadOrigen, unidadDestino) => {
  const cant = parseFloat(cantidad) || 0
  if (unidadOrigen === unidadDestino) return cant

  const factores = {
    Quintales: 100, // 1 QQ = 100 Lbs
    Kilogramos: 2.20462, // 1 Kg = 2.20462 Lbs
    Libras: 1,
    Unidades: 1,
  }

  const enLibras = cant * (factores[unidadOrigen] || 1)
  const resultado = enLibras / (factores[unidadDestino] || 1)
  return resultado
}

const registrarLiquidacion = async (data) => {
  const { liquidacion, detalle, retencion, anticipo, CajaId } = data
  const { UsuarioId, ProductorId } = liquidacion

  // 1. Validaciones de Integridad
  const [usuario, productor, caja] = await Promise.all([
    Usuario.findOne({ where: { id: UsuarioId } }),
    Persona.findOne({ where: { id: ProductorId, tipo: 'Productor' } }),
    CajaId ? Caja.findOne({ where: { id: CajaId } }) : null,
  ])

  if (!usuario) return { code: 400, message: 'Usuario no encontrado.' }
  if (!productor) return { code: 400, message: 'El productor no existe.' }
  if (!caja || caja.estado !== 'Abierta') {
    return { code: 400, message: 'Se requiere una caja abierta para esta operación.' }
  }

  const t = await sq.transaction()

  try {
    // 2. Correlativo de Liquidación
    const totalLiquidaciones = await Liquidacion.count({ transaction: t })
    const codigoLiq = 'LIQ-' + String(totalLiquidaciones + 1).padStart(7, '0')

    // 3. Cabecera (liquidacion.totalAPagar ya viene como Subtotal - Retenciones)
    const nuevaLiquidacion = await Liquidacion.create(
      { ...liquidacion, codigo: codigoLiq },
      { transaction: t }
    )

    // 4. CRUCE DE ANTICIPOS (Contable - Sin afectar flujo físico de hoy)
    let montoAnticipoAplicado = 0
    if (anticipo && parseFloat(anticipo.montoAplicado) > 0) {
      montoAnticipoAplicado = parseFloat(anticipo.montoAplicado)
      const antOriginal = await Anticipo.findByPk(anticipo.id, { transaction: t })

      if (antOriginal) {
        await LiquidacionAnticipo.create(
          {
            montoAplicado: montoAnticipoAplicado,
            AnticipoId: antOriginal.id,
            LiquidacionId: nuevaLiquidacion.id,
          },
          { transaction: t }
        )

        const nuevoSaldo = parseFloat(antOriginal.saldoPendiente) - montoAnticipoAplicado
        await antOriginal.update(
          {
            saldoPendiente: nuevoSaldo,
            estado: nuevoSaldo <= 0 ? 'Aplicado' : 'Pendiente',
          },
          { transaction: t }
        )

        // Actualizar Cuenta por Cobrar relacionada (El productor nos debía, ahora paga con cacao)
        const cxc = await CuentasPorCobrar.findOne({
          where: { referenciaId: antOriginal.id, origen: 'Anticipo' },
          transaction: t,
        })
        if (cxc) {
          const saldoCxC = parseFloat(cxc.montoPorCobrar) - montoAnticipoAplicado
          await cxc.update(
            { montoPorCobrar: saldoCxC, estado: saldoCxC <= 0 ? 'Cobrado' : 'Pendiente' },
            { transaction: t }
          )
        }

        // Movimiento INFORMATIVO (CajaId: null porque no es dinero que entra a la gaveta hoy)
        await Movimiento.create(
          {
            tipoMovimiento: 'Ingreso',
            categoria: 'Cobro Anticipo',
            monto: montoAnticipoAplicado,
            idReferencia: nuevaLiquidacion.id,
            CajaId: null,
            descripcion: `CRUCE CONTABLE: Anticipo cruzado en ${codigoLiq}.`,
          },
          { transaction: t }
        )
      }
    }

    // 5. Detalle de Compra
    await DetalleLiquidacion.create(
      { ...detalle, LiquidacionId: nuevaLiquidacion.id },
      { transaction: t }
    )

    // 6. ACTUALIZACIÓN DE STOCK (Conversión Agrícola)
    const productoBodega = await Producto.findByPk(detalle.ProductoId, { transaction: t })
    const unidadEnBodega = productoBodega.unidadMedida || 'Quintales'
    const cantidadFinalStock = convertirUnidadesBodega(
      detalle.cantidadNeta,
      detalle.unidad,
      unidadEnBodega
    )

    await productoBodega.update(
      { stock: parseFloat(productoBodega.stock) + cantidadFinalStock },
      { transaction: t }
    )

    // 7. Registro de Retención SRI
    if (retencion) {
      await Retencion.create(
        { ...retencion, LiquidacionId: nuevaLiquidacion.id },
        { transaction: t }
      )
    }

    // 8. CUENTAS POR PAGAR (Ajuste de Saldo Real)
    // El monto total que se le debe tras descuentos es: (Subtotal - Retenciones) - Anticipo
    const totalNetoTrasCruce = parseFloat(liquidacion.totalAPagar) - montoAnticipoAplicado
    const saldoFinalDeuda = totalNetoTrasCruce - parseFloat(liquidacion.montoAbonado)

    if (saldoFinalDeuda > 0) {
      await CuentasPorPagar.create(
        {
          montoTotal: totalNetoTrasCruce,
          montoAbonado: parseFloat(liquidacion.montoAbonado),
          saldoPendiente: saldoFinalDeuda,
          estado: 'Pendiente',
          LiquidacionId: nuevaLiquidacion.id,
        },
        { transaction: t }
      )
    }

    // 9. FLUJO DE CAJA REAL (Solo lo que sale físicamente hoy)
    const pEfec = parseFloat(liquidacion.pagoEfectivo || 0)
    const pTran = parseFloat(liquidacion.pagoTransferencia || 0)
    const pCheq = parseFloat(liquidacion.pagoCheque || 0)

    // EFECTIVO: Descuento físico de la caja de la oficina
    if (pEfec > 0) {
      await Movimiento.create(
        {
          tipoMovimiento: 'Egreso',
          categoria: 'Compra',
          monto: pEfec,
          idReferencia: nuevaLiquidacion.id,
          CajaId: CajaId,
          descripcion: `PAGO EFECTIVO: Liq ${codigoLiq} (Neto entregado)`,
        },
        { transaction: t }
      )
      await caja.decrement({ saldoActual: pEfec }, { transaction: t })
    }

    // BANCOS/CHEQUES: Registro contable informativo para conciliación
    const totalBancario = pTran + pCheq
    if (totalBancario > 0) {
      await Movimiento.create(
        {
          tipoMovimiento: 'Egreso',
          categoria: 'Compra',
          monto: totalBancario,
          idReferencia: nuevaLiquidacion.id,
          CajaId: CajaId,
          descripcion: `PAGO BANCARIO: Liq ${codigoLiq} (Transf/Cheq)`,
        },
        { transaction: t }
      )
    }

    await t.commit()
    const cajaRefrescada = await Caja.findByPk(CajaId)

    return {
      code: 201,
      caja: cajaRefrescada,
      message: 'Liquidación procesada con éxito.',
      id: nuevaLiquidacion.id,
    }
  } catch (error) {
    if (t) await t.rollback()
    console.error('CRITICAL ERROR:', error)
    return { code: 500, message: 'Error interno en el servidor.', error: error.message }
  }
}

export { registrarLiquidacion }
