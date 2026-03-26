import {
  Venta,
  Producto,
  Persona,
  Usuario,
  Caja,
  Movimiento,
  CuentasPorCobrar,
  sq,
} from '../../libs/db.js'

/**
 * FUNCIÓN DE CONVERSIÓN UNIVERSAL
 */
const convertirUnidades = (cantidad, unidadOrigen, unidadDestino) => {
  const valor = parseFloat(cantidad) || 0
  if (unidadOrigen === unidadDestino) return valor

  let libras = 0
  switch (unidadOrigen) {
    case 'Libras':
      libras = valor
      break
    case 'Quintales':
      libras = valor * 100
      break
    case 'Kilogramos':
      libras = valor * 2.20462
      break
    case 'Arroba':
      libras = valor * 25
      break
    default:
      libras = valor
  }

  switch (unidadDestino) {
    case 'Libras':
      return libras
    case 'Quintales':
      return libras / 100
    case 'Kilogramos':
      return libras / 2.20462
    case 'Arroba':
      return libras / 25
    default:
      return libras
  }
}

const registrarVenta = async (data) => {
  const t = await sq.transaction()

  try {
    const { venta, CajaId } = data
    const {
      PersonaId,
      UsuarioId,
      ProductoId,
      cantidadNeta,
      unidad,
      precioUnitario,
      totalFactura,
      // Nuevos campos de retención
      retencionPorcentaje = 0,
      valorRetenido = 0,
      // Campos financieros
      montoAbonado = 0,
      montoAnticipo = 0,
      tipoVenta,
    } = venta

    // 1. Validaciones de existencia
    const [comprador, usuario, producto, caja] = await Promise.all([
      Persona.findByPk(PersonaId),
      Usuario.findByPk(UsuarioId),
      Producto.findByPk(ProductoId),
      Caja.findOne({ where: { id: CajaId, estado: 'Abierta' } }),
    ])

    if (!comprador) throw new Error('El cliente no existe.')
    if (!producto) throw new Error('El producto no existe.')
    if (!caja) throw new Error('No hay una caja abierta para procesar el ingreso.')

    // 2. Validación de Stock
    const stockARetirar = convertirUnidades(cantidadNeta, unidad, producto.unidadMedida)
    if (parseFloat(producto.stock) < stockARetirar) {
      throw new Error(`Stock insuficiente. Disponible: ${producto.stock} ${producto.unidadMedida}.`)
    }

    // 3. Generar Código Correlativo
    const ultimaVenta = await Venta.count()
    const codigoVenta = `VNT-${(ultimaVenta + 1).toString().padStart(7, '0')}`

    // --- LÓGICA FINANCIERA CORREGIDA ---
    const totalF = parseFloat(totalFactura)
    const vRetenido = parseFloat(valorRetenido || 0)
    const anticipo = parseFloat(montoAnticipo || 0)
    const abonadoHoy = parseFloat(montoAbonado || 0)

    /**
     * totalALiquidar: Es lo que el cliente REALMENTE debe cubrir hoy.
     * Se resta la retención (porque es dinero que no recibes/pagas tú, sino que se queda el estado)
     * Se resta el anticipo (porque ya se cruzó cuenta)
     */
    const totalALiquidar = totalF - vRetenido - anticipo

    // Lo pendiente es lo que faltó por pagar del valor líquido
    const pendiente = totalALiquidar - abonadoHoy

    // 4. CREAR EL REGISTRO DE VENTA
    const nuevaVenta = await Venta.create(
      {
        ...venta,
        codigoVenta,
        valorRetenido: vRetenido,
        montoAnticipo: anticipo,
        totalALiquidar: totalALiquidar,
        montoAbonado: abonadoHoy,
        montoPendiente: pendiente > 0 ? pendiente : 0,
        CajaId: caja.id,
      },
      { transaction: t }
    )

    // 5. ACTUALIZAR STOCK
    await producto.decrement('stock', { by: stockARetirar, transaction: t })

    // 6. FLUJO DE DINERO EN CAJA (Solo lo que entra FÍSICAMENTE hoy)
    if (abonadoHoy > 0) {
      await Movimiento.create(
        {
          tipoMovimiento: 'Ingreso',
          categoria: 'Venta',
          monto: abonadoHoy,
          descripcion: `VENTA ${codigoVenta} | LIQUIDO: $${totalALiquidar.toFixed(2)} | RET: $${vRetenido.toFixed(2)}`,
          idReferencia: nuevaVenta.id,
          CajaId: caja.id,
        },
        { transaction: t }
      )

      await caja.increment('saldoActual', { by: abonadoHoy, transaction: t })
    }

    // 7. CUENTA POR COBRAR
    // Si queda saldo pendiente o es explícitamente a crédito
    if (pendiente > 0 || tipoVenta === 'Crédito') {
      await CuentasPorCobrar.create(
        {
          PersonaId: comprador.id,
          montoTotal: totalF,
          // Lo que ya está "cubierto" de la factura original
          montoEfectivo: abonadoHoy + anticipo + vRetenido,
          montoPorCobrar: pendiente > 0 ? pendiente : 0,
          estado: pendiente <= 0 ? 'Pagado' : 'Pendiente',
          origen: 'Venta',
          referenciaId: nuevaVenta.id,
          fecha: new Date(),
        },
        { transaction: t }
      )
    }

    await t.commit()
    return {
      code: 201,
      message: 'Venta registrada con éxito.',
      data: nuevaVenta,
    }
  } catch (error) {
    if (t) await t.rollback()
    console.error('ERROR_VENTA_AROMA_ORO:', error.message)
    return { code: 400, message: error.message }
  }
}

export { registrarVenta }
