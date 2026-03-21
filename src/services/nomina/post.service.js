import { Op } from 'sequelize'
import { Caja, Movimiento, Nomina, Persona, sq } from '../../libs/db.js'

const pagarJornal = async (data) => {
  const { UsuarioId, diasTrabajados, valorJornal, bono, descuento, CajaId, PersonaId } = data

  // Iniciamos la transacción para asegurar consistencia
  const t = await sq.transaction()

  try {
    // 1. Validar que el empleado exista
    const persona = await Persona.findByPk(PersonaId, { transaction: t })

    if (!persona) {
      await t.rollback()
      return { code: 404, message: 'Empleado no encontrado' }
    }

    // 2. Validar que la caja esté abierta y traer el saldoActual
    const caja = await Caja.findOne({
      where: { id: CajaId, estado: 'Abierta' },
      transaction: t,
    })

    if (!caja) {
      await t.rollback()
      return { code: 400, message: 'La caja no está abierta o no existe' }
    }

    // 3. Cálculos del pago
    const montoBono = parseFloat(bono || 0)
    const montoDescuento = parseFloat(descuento || 0)
    const subTotal = parseFloat(diasTrabajados) * parseFloat(valorJornal) + montoBono
    const totalAPagar = subTotal - montoDescuento

    // 4. VALIDACIÓN CRÍTICA: ¿Hay dinero real en la caja física?
    if (totalAPagar > parseFloat(caja.saldoActual)) {
      await t.rollback()
      return {
        code: 400,
        message: `Saldo insuficiente. Tienes $${caja.saldoActual} y el pago es de $${totalAPagar.toFixed(2)}`,
      }
    }

    // 5. Evitar doble pago en el mismo día
    const hoy = new Date()
    const inicioDia = new Date(hoy.setHours(0, 0, 0, 0))
    const finDia = new Date(hoy.setHours(23, 59, 59, 999))

    const pagoExistente = await Nomina.findOne({
      where: {
        PersonaId,
        createdAt: { [Op.between]: [inicioDia, finDia] },
      },
      transaction: t,
    })

    if (pagoExistente) {
      await t.rollback()
      return { code: 400, message: 'Ya se registró un pago para este empleado el día de hoy' }
    }

    // 6. Crear el registro de Nómina
    const pago = await Nomina.create(
      {
        diasTrabajados,
        subTotal,
        descuento: montoDescuento,
        valorJornal,
        total: totalAPagar,
        bono: montoBono,
        PersonaId,
        UsuarioId,
      },
      { transaction: t }
    )

    // 7. Crear el Movimiento (Egreso)
    await Movimiento.create(
      {
        monto: totalAPagar,
        tipoMovimiento: 'Egreso',
        categoria: 'Nomina',
        CajaId,
        idReferencia: pago.id,
      },
      { transaction: t }
    )

    // 8. ACTUALIZAR CAJA: Restamos del saldoActual
    // Importante: También podrías actualizar montoEsperado aquí si quieres llevar ambos,
    // pero saldoActual es el que manda para el día a día.
    await caja.decrement('saldoActual', {
      by: totalAPagar,
      transaction: t,
    })

    // Confirmamos todos los cambios
    await t.commit()

    // Retornamos la caja actualizada para el frontend
    const cajaFinal = await Caja.findByPk(CajaId)

    return {
      code: 200,
      message: `Pago de $${totalAPagar.toFixed(2)} realizado con éxito`,
      caja: cajaFinal,
    }
  } catch (error) {
    if (t) await t.rollback()
    console.error('Error en pagarJornal:', error)
    return { code: 500, message: 'Error interno al procesar el pago de jornal' }
  }
}

export { pagarJornal }
