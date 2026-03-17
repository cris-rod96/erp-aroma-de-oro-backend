import { Op } from 'sequelize'
import { Caja, Movimiento, Nomina, Persona, sq, Usuario } from '../../libs/db.js'

const pagarJornal = async (data) => {
  const { UsuarioId, diasTrabajados, valorJornal, bono, descuento, CajaId, PersonaId } = data
  const t = await sq.transaction()

  try {
    const persona = await Persona.findOne({
      where: { id: PersonaId },
      transaction: t,
    })

    if (!persona) {
      await t.rollback()
      return { code: 400, message: 'Empleado no encontrado' }
    }

    // Validar caja

    const caja = await Caja.findOne({
      where: {
        id: CajaId,
      },
      transaction: t,
    })

    if (!caja || caja.estado !== 'Abierta') {
      await t.rollback()
      return { code: 400, message: 'La caja no esta abierta o no existe' }
    }

    const subTotal = parseFloat(diasTrabajados) * parseFloat(valorJornal) + parseFloat(bono || 0)
    const total = subTotal - parseFloat(descuento || 0)

    if (total > parseFloat(caja.montoEsperado)) {
      await t.rollback()
      return { code: 400, message: 'Saldo insuficiente en caja para este pago' }
    }

    const hoy = new Date()
    const inicio = new Date(hoy.setHours(0, 0, 0, 0))
    const fin = new Date(hoy.setHours(23, 59, 59, 999))

    const pagoExistente = await Nomina.findOne({
      where: {
        PersonaId,
        fechaPago: { [Op.between]: [inicio, fin] },
      },
      transaction: t,
    })

    if (pagoExistente) {
      await t.rollback()
      return { code: 400, message: 'Ya existe un pago hoy para este empleado' }
    }

    // Crear el registro de Nomina
    const pago = await Nomina.create(
      {
        diasTrabajados,
        subTotal,
        descuento,
        valorJornal,
        total,
        bono,
        PersonaId,
        UsuarioId,
      },
      { transaction: t }
    )

    // Crear movimiento
    await Movimiento.create(
      {
        monto: total,
        tipoMovimiento: 'Egreso',
        categoria: 'Nomina',
        CajaId,
        idReferencia: pago.id,
      },
      {
        transaction: t,
      }
    )

    // Actulizar caja
    await caja.decrement('montoEsperado', { by: total, transaction: t })
    await t.commit()

    const cajaActualizada = await Caja.findByPk(CajaId)

    return {
      code: 200,
      message: 'Pago realizado y monto de caja actualizado',
      caja: cajaActualizada,
    }
  } catch (error) {
    if (t) await t.rollback()
    console.log('Error en pagar jornal: ', error)
    return { code: 500, message: 'Error interno al procesar el pago' }
  }
}

export { pagarJornal }
