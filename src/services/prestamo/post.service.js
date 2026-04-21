import { Caja, CuentasPorCobrar, Movimiento, Prestamo, sq } from '../../libs/db.js'

const crearPrestamo = async (data) => {
  const { PersonaId, CajaId, montoTotal, cuotasPactadas, UsuarioId, comentario } = data
  const t = await sq.transaction()

  try {
    // 0. VALIDACIÓN: ¿Tiene préstamos pendientes?
    const prestamoActivo = await Prestamo.findOne({
      where: {
        PersonaId: PersonaId,
        estado: 'Pendiente', // Respetando tu formato de texto
      },
      transaction: t,
    })

    if (prestamoActivo) {
      await t.rollback()
      return {
        code: 400,
        message:
          'El trabajador ya tiene un préstamo pendiente. Debe liquidarlo para solicitar otro.',
      }
    }

    // 1. Validaciones de Caja
    const caja = await Caja.findByPk(CajaId, { transaction: t })
    if (!caja || caja.estado !== 'Abierta') {
      await t.rollback() // Siempre rollback antes de retornar error
      return { code: 400, message: 'La caja seleccionada no está abierta' }
    }

    if (parseFloat(caja.saldoActual) < parseFloat(montoTotal)) {
      await t.rollback()
      return { code: 400, message: 'Saldo insuficiente en caja' }
    }

    // 2. REGISTRO DEL PRÉSTAMO
    const montoCuota = parseFloat(montoTotal) / parseInt(cuotasPactadas)
    const nuevoPrestamo = await Prestamo.create(
      {
        montoTotal,
        cuotasPactadas,
        cuotasPagadas: 0,
        montoCuota: montoCuota.toFixed(2),
        saldoPendiente: montoTotal,
        estado: 'Pendiente',
        PersonaId,
        CajaId,
        UsuarioId,
        comentario: comentario || 'Préstamo personal',
      },
      { transaction: t }
    )

    // 3. MOVIMIENTO DE CAJA (Salida de dinero)
    await Movimiento.create(
      {
        tipoMovimiento: 'Egreso',
        categoria: 'Préstamo',
        monto: montoTotal,
        idReferencia: nuevoPrestamo.id,
        descripcion: `Desembolso Préstamo. Ref: ${nuevoPrestamo.id.substring(0, 8)}`,
        CajaId: CajaId,
      },
      { transaction: t }
    )

    // 4. CONTROL DE DEUDA (Cuenta por Cobrar)
    await CuentasPorCobrar.create(
      {
        montoTotal: montoTotal,
        montoPorCobrar: montoTotal,
        estado: 'Pendiente',
        origen: 'Préstamo',
        referenciaId: nuevoPrestamo.id,
        fecha: new Date(),
      },
      { transaction: t }
    )

    // 5. ACTUALIZAR SALDO DE CAJA Y RECARGAR DATOS
    await caja.decrement('saldoActual', { by: montoTotal, transaction: t })
    await caja.reload({ transaction: t })

    await t.commit()

    return {
      code: 201,
      message: 'Préstamo y Cuenta por Cobrar creados con éxito',
      caja,
    }
  } catch (error) {
    if (t) await t.rollback()
    console.error('Error en crearPrestamo:', error)
    return { code: 500, message: 'Error interno del servidor' }
  }
}

const prestamoTerceros = async (data) => {
  const { CajaId, montoTotal, comentario, UsuarioId } = data
  const t = await sq.transaction()

  try {
    const caja = await Caja.findByPk(CajaId, { transaction: t })
    if (!caja || caja.estado !== 'Abierta') {
      await t.rollback() // Siempre rollback antes de retornar error
      return { code: 400, message: 'La caja seleccionada no está abierta' }
    }

    if (parseFloat(caja.saldoActual) < parseFloat(montoTotal)) {
      await t.rollback()
      return { code: 400, message: 'Saldo insuficiente en caja' }
    }

    const montoCuota = parseFloat(montoTotal) / 1
    const nuevoPrestamo = await Prestamo.create(
      {
        montoTotal,
        cuotasPactadas: 1,
        cuotasPagadas: 0,
        montoCuota: montoCuota.toFixed(2),
        saldoPendiente: montoTotal,
        estado: 'Pendiente',
        PersonaId: null,
        CajaId,
        UsuarioId,
        comentario: comentario || 'Préstamo a tercero',
      },
      { transaction: t }
    )

    await Movimiento.create(
      {
        tipoMovimiento: 'Egreso',
        categoria: 'Préstamo',
        monto: montoTotal,
        idReferencia: nuevoPrestamo.id,
        descripcion: `Desembolso Préstamo. Ref: ${nuevoPrestamo.id.substring(0, 8)}`,
        CajaId: CajaId,
      },
      { transaction: t }
    )

    await CuentasPorCobrar.create(
      {
        montoTotal: montoTotal,
        montoPorCobrar: montoTotal,
        estado: 'Pendiente',
        origen: 'Préstamo',
        referenciaId: nuevoPrestamo.id,
        fecha: new Date(),
      },
      { transaction: t }
    )

    await caja.decrement('saldoActual', { by: montoTotal, transaction: t })
    await caja.reload({ transaction: t })

    await t.commit()

    return {
      code: 201,
      message: 'Préstamo y Cuenta por Cobrar creados con éxito',
      caja,
    }
  } catch (error) {
    if (t) await t.rollback()
    console.error('Error en crearPrestamo:', error)
    return { code: 500, message: 'Error interno del servidor' }
  }
}

export { crearPrestamo, prestamoTerceros }
