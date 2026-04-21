import {
  AbonosCuentasPorCobrar,
  Caja,
  CuentasPorCobrar,
  Movimiento,
  Venta,
  sq,
} from '../../libs/db.js'

const registrarCobro = async (data) => {
  const t = await sq.transaction()
  try {
    const { CuentaPorCobrarId, monto, metodoCobro, CajaId, origen, afectaCaja, UsuarioId } = data

    const montoAbono = parseFloat(monto)

    // 1. Bloqueamos la fila para evitar condiciones de carrera (Race Conditions)
    const cuenta = await CuentasPorCobrar.findByPk(CuentaPorCobrarId, {
      transaction: t,
      lock: true,
    })

    if (!cuenta) throw new Error('La cuenta por cobrar no existe.')

    // 2. Validación de exceso de cobro
    const saldoPendienteActual = parseFloat(cuenta.montoPorCobrar)
    if (montoAbono > saldoPendienteActual) {
      throw new Error(
        `El monto ($${montoAbono}) excede el saldo pendiente ($${saldoPendienteActual}).`
      )
    }

    // 3. Actualización del origen (Venta)
    if (origen === 'Venta' && cuenta.referenciaId) {
      const venta = await Venta.findByPk(cuenta.referenciaId, { transaction: t })
      if (venta) {
        const updateVenta = {
          montoAbonado: parseFloat(venta.montoAbonado) + montoAbono,
          montoPendiente: parseFloat(venta.montoPendiente) - montoAbono,
        }
        if (metodoCobro === 'Efectivo')
          updateVenta.pagoEfectivo = (parseFloat(venta.pagoEfectivo) || 0) + montoAbono
        if (metodoCobro === 'Transferencia')
          updateVenta.pagoTransferencia = (parseFloat(venta.pagoTransferencia) || 0) + montoAbono

        await venta.update(updateVenta, { transaction: t })
      }
    }

    // 4. Actualizar la Cuenta por Cobrar (CxC)
    const nuevoSaldo = saldoPendienteActual - montoAbono
    const updateCxC = {
      montoPorCobrar: nuevoSaldo,
      estado: nuevoSaldo <= 0 ? 'Cobrado' : 'Pendiente',
    }

    // Sumar al acumulador correspondiente según el método
    if (metodoCobro === 'Efectivo')
      cuenta.montoEfectivo = parseFloat(cuenta.montoEfectivo) + montoAbono
    if (metodoCobro === 'Transferencia')
      cuenta.montoTransferencia = parseFloat(cuenta.montoTransferencia) + montoAbono
    if (metodoCobro === 'Cheque') cuenta.montoCheque = parseFloat(cuenta.montoCheque) + montoAbono

    await cuenta.update(updateCxC, { transaction: t })

    // 5. Registro de Abono
    const nuevoAbono = await AbonosCuentasPorCobrar.create(
      {
        monto: montoAbono,
        metodoCobro,
        CuentaPorCobrarId,
        fechaCobro: new Date(),
        UsuarioId,
      },
      { transaction: t }
    )

    // 6. Afectar Caja (Solo si es efectivo)
    if (afectaCaja && metodoCobro === 'Efectivo') {
      const descripcionMovimiento = `Cobro de ${origen} - Comprobante Ref: ${cuenta.id.slice(0, 6) || 'S/N'}. Monto: $${montoAbono}`
      await Movimiento.create(
        {
          tipoMovimiento: 'Ingreso',
          categoria: 'Cuentas por Cobrar',
          monto: montoAbono,
          CajaId,
          idReferencia: nuevoAbono.id,
          descripcion: descripcionMovimiento,
        },
        { transaction: t }
      )
      await Caja.increment('saldoActual', { by: montoAbono, where: { id: CajaId }, transaction: t })
    }

    await t.commit()
    return { code: 200, message: 'Cobro procesado exitosamente.' }
  } catch (error) {
    if (t) await t.rollback()
    return { code: 400, message: error.message } // 400 para errores de validación
  }
}

export { registrarCobro }
