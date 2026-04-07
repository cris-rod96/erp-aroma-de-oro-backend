import {
  CuentasPorCobrar,
  AbonosCuentasPorCobrar,
  Caja,
  Movimiento,
  Prestamo,
  Anticipo,
  Venta,
  sq,
} from '../../libs/db.js'

const registrarCobro = async (data) => {
  const t = await sq.transaction()

  try {
    const {
      CuentaPorCobrarId,
      monto,
      metodoCobro,
      UsuarioId,
      CajaId,
      descripcion,
      origen,
      afectaCaja, // Viene del switch del frontend
    } = data

    const montoAbono = parseFloat(monto)

    // 1. VALIDAR CAJA (Solo si se marcó que afecta caja)
    let cajaActiva = null
    if (afectaCaja && CajaId) {
      cajaActiva = await Caja.findByPk(CajaId)
      if (!cajaActiva || cajaActiva.estado !== 'Abierta') {
        return { code: 400, message: 'La caja seleccionada no está disponible o está cerrada.' }
      }
    }

    // 2. BUSCAR CUENTA POR COBRAR
    const cuenta = await CuentasPorCobrar.findByPk(CuentaPorCobrarId)
    if (!cuenta) throw new Error('Cuenta por cobrar no encontrada.')

    const idRef = cuenta.referenciaId

    // 3. ACTUALIZAR EL MODELO DE ORIGEN (Venta/Prestamo/Anticipo)
    // Esta parte siempre se ejecuta para que la deuda baje
    switch (origen) {
      case 'Préstamo':
        const prestamo = await Prestamo.findByPk(idRef)
        if (prestamo) {
          const nuevoSaldoP = parseFloat(prestamo.saldoPendiente) - montoAbono
          let cuotasActualizadas = prestamo.cuotasPagadas + 1
          if (nuevoSaldoP <= 0) cuotasActualizadas = prestamo.cuotasPactadas

          await prestamo.update(
            {
              saldoPendiente: nuevoSaldoP <= 0 ? 0 : nuevoSaldoP,
              cuotasPagadas: cuotasActualizadas,
              estado: nuevoSaldoP <= 0 ? 'Pagado' : 'Pendiente',
            },
            { transaction: t }
          )
        }
        break

      case 'Anticipo':
        const anticipo = await Anticipo.findByPk(idRef)
        if (anticipo) {
          const nuevoSaldoA = parseFloat(anticipo.saldoPendiente) - montoAbono
          await anticipo.update(
            {
              saldoPendiente: nuevoSaldoA <= 0 ? 0 : nuevoSaldoA,
              estado: nuevoSaldoA <= 0 ? 'Aplicado' : 'Pendiente',
            },
            { transaction: t }
          )
        }
        break

      case 'Venta':
        const venta = await Venta.findByPk(idRef)
        if (venta) {
          const nuevoMontoP = parseFloat(venta.montoPendiente) - montoAbono
          await venta.update(
            {
              montoAbonado: parseFloat(venta.montoAbonado) + montoAbono,
              montoPendiente: nuevoMontoP <= 0 ? 0 : nuevoMontoP,
            },
            { transaction: t }
          )
        }
        break
    }

    // 4. REGISTRAR ABONO (Auditoría siempre se guarda)
    const nuevoAbono = await AbonosCuentasPorCobrar.create(
      {
        monto: montoAbono,
        metodoCobro,
        CuentaPorCobrarId,
        UsuarioId,
        fechaCobro: new Date(),
      },
      { transaction: t }
    )

    // 5. ACTUALIZAR CUENTA POR COBRAR (Saldos globales de la cartera)
    const saldoRestante = parseFloat(cuenta.montoPorCobrar) - montoAbono
    const camposUpdate = {
      montoPorCobrar: saldoRestante <= 0 ? 0 : saldoRestante,
      estado: saldoRestante <= 0 ? 'Cobrado' : 'Pendiente',
    }

    // Clasificación del dinero para reportes de cartera
    if (metodoCobro === 'Efectivo')
      camposUpdate.montoEfectivo = parseFloat(cuenta.montoEfectivo) + montoAbono
    if (metodoCobro === 'Transferencia')
      camposUpdate.montoTransferencia = parseFloat(cuenta.montoTransferencia) + montoAbono

    await cuenta.update(camposUpdate, { transaction: t })

    // 6. LÓGICA DE CAJA (SOLO SI afectaCaja ES TRUE)
    if (afectaCaja && cajaActiva) {
      // Registrar el movimiento en el libro de caja
      await Movimiento.create(
        {
          tipoMovimiento: 'Ingreso',
          categoria: 'Cuentas por Cobrar',
          monto: montoAbono,
          idReferencia: nuevoAbono.id,
          descripcion: descripcion || `Cobro ${origen} - Ref: ${idRef} (Ingreso a Caja)`,
          CajaId: cajaActiva.id,
          fecha: new Date(),
        },
        { transaction: t }
      )

      // Actualizar el saldo físico de la caja
      await cajaActiva.update(
        {
          saldoActual: parseFloat(cajaActiva.saldoActual) + montoAbono,
        },
        { transaction: t }
      )
    }

    await t.commit()

    return {
      code: 200,
      message: afectaCaja
        ? `Cobro procesado e ingresado a caja correctamente.`
        : `Cobro procesado (No ingresó a caja física).`,
      cajaActualizada: cajaActiva, // Si es null, el frontend no actualiza el store de caja
    }
  } catch (error) {
    if (t) await t.rollback()
    console.error('Error Crítico Aroma de Oro:', error)
    return { code: 500, message: error.message }
  }
}

export { registrarCobro }
