import { Caja, CuentasPorCobrar, Movimiento, sq } from '../../libs/db.js'

const crearPrestamoTercero = async (data) => {
  const { CajaId, UsuarioId, comentario, montoTotal } = data
  const t = await sq.transaction()
  try {
    const caja = await Caja.findByPk(CajaId, { transaction: t })
    if (!caja || caja.estado !== 'Abierta') {
      await t.rollback()
      return { code: 400, message: 'La caja seleccionada no está abierta' }
    }

    if (parseFloat(caja.saldoActual) < parseFloat(montoTotal)) {
      await t.rollback()
      return { code: 400, message: 'Saldo insuficiente en caja' }
    }

    const cuentaPorCobrar = await CuentasPorCobrar.create(data)

    await Movimiento.create(
      {
        tipoMovimiento: 'Egreso',
        categoria: 'Cuentas por Cobrar',
        monto: montoTotal,
        idReferencia: cuentaPorCobrar.id,
        descripcion: comentario,
        CajaId: CajaId,
      },
      { transaction: t }
    )

    await caja.decrement('saldoActual', { by: montoTotal, transaction: t })
    await caja.reload({ transaction: t })
    await t.commit()

    return {
      code: 201,
      message: 'Préstamo a tercero generado con éxito',
      caja,
    }
  } catch (error) {
    if (t) await t.rollback()
    console.error('Error en crearPrestamoTercero:', error)
    return { code: 500, message: 'Error interno del servidor' }
  }
}

export { crearPrestamoTercero }
