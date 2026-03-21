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
} from '../../libs/db.js'

/**
 * Función de utilidad para normalizar unidades a Quintales antes de ingresar al stock.
 */
const convertirAQuintales = (cantidad, unidadOrigen) => {
  const cant = parseFloat(cantidad)

  switch (unidadOrigen) {
    case 'Kilogramos':
      return cant / 45.36
    case 'Libras':
      return cant / 100
    case 'Quintales':
      return cant
    default:
      return cant
  }
}

const registrarLiquidacion = async (data) => {
  const { liquidacion, detalle, retencion, CajaId } = data
  const { UsuarioId, ProductorId } = liquidacion

  // 1. Validaciones previas
  const [usuario, productor, caja] = await Promise.all([
    Usuario.findOne({ where: { id: UsuarioId } }),
    Persona.findOne({ where: { id: ProductorId, tipo: 'Productor' } }),
    CajaId ? Caja.findOne({ where: { id: CajaId } }) : null,
  ])

  if (!usuario) return { code: 400, message: 'Usuario no encontrado.' }
  if (!productor) return { code: 400, message: 'El productor no existe.' }
  if (!caja) return { code: 400, message: 'Debe existir una caja para esta operación' }
  if (caja.estado !== 'Abierta')
    return { code: 400, message: 'La caja se encuentra cerrada. Debe abrir una nueva.' }

  const t = await sq.transaction()

  try {
    // 2. Generar código correlativo de liquidación
    const totalLiquidaciones = await Liquidacion.count({ transaction: t })
    const codigoLiq = 'LIQ-' + String(totalLiquidaciones + 1).padStart(7, '0')

    // 3. Crear cabecera de Liquidación
    const nuevaLiquidacion = await Liquidacion.create(
      { ...liquidacion, codigo: codigoLiq },
      { transaction: t }
    )

    // 4. Crear detalle de la liquidación
    await DetalleLiquidacion.create(
      { ...detalle, LiquidacionId: nuevaLiquidacion.id },
      { transaction: t }
    )

    // 5. Actualizar Stock con conversión de unidades
    const producto = await Producto.findOne({
      where: { id: detalle.ProductoId },
      transaction: t,
    })

    const cantidadConvertida = convertirAQuintales(detalle.cantidad, detalle.unidad)

    await producto.update(
      { stock: parseFloat(producto.stock) + cantidadConvertida },
      { transaction: t }
    )

    // 6. Registro de Retención (si aplica)
    if (retencion) {
      await Retencion.create(
        { ...retencion, LiquidacionId: nuevaLiquidacion.id },
        { transaction: t }
      )
    }

    // 7. Gestión de Cuentas por Pagar
    const saldoPendiente = parseFloat(liquidacion.montoPorPagar)
    if (saldoPendiente > 0) {
      await CuentasPorPagar.create(
        {
          montoTotal: parseFloat(liquidacion.totalAPagar),
          montoAbonado: parseFloat(liquidacion.montoAbonado),
          saldoPendiente: saldoPendiente,
          estado: 'Pendiente',
          LiquidacionId: nuevaLiquidacion.id,
        },
        { transaction: t }
      )
    }

    // 8. Movimiento de Caja y Actualización de Saldo Esperado
    const montoEfectivoPagado = parseFloat(liquidacion.pagoEfectivo)

    if (montoEfectivoPagado > 0) {
      // 8.1 Registrar el movimiento de egreso (Auditoría)
      await Movimiento.create(
        {
          tipoMovimiento: 'Egreso',
          categoria: 'Compra',
          monto: montoEfectivoPagado,
          idReferencia: nuevaLiquidacion.id,
          CajaId: CajaId,
        },
        { transaction: t }
      )

      /**
       * USO DE DECREMENT:
       * Evitamos traer el valor a JS, restarlo y volverlo a enviar.
       * La base de datos resta el valor internamente, garantizando
       * integridad si hay dos liquidaciones al mismo milisegundo.
       */
      await caja.decrement({ saldoActual: montoEfectivoPagado }, { transaction: t })
    }

    // 9. Finalizar Ticket
    // await ticket.update({ estadoTicket: 'Liquidado' }, { transaction: t })

    await t.commit()
    const cajaActualizada = await Caja.findByPk(CajaId)

    return {
      code: 201,
      caja: cajaActualizada,
      message: 'Liquidación creada con éxito y saldo de caja actualizado.',
      id: nuevaLiquidacion.id,
    }
  } catch (error) {
    await t.rollback()
    console.error('Fallo en registrarLiquidacion:', error)
    return {
      code: 500,
      message: 'Error crítico: No se pudo completar la liquidación',
      error: error.message,
    }
  }
}

export { registrarLiquidacion }
