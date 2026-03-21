import { Caja, Movimiento } from '../../libs/db.js'

const cerrarCaja = async (id, data) => {
  const caja = await Caja.findByPk(id)

  if (!caja) return { code: 404, message: 'Caja no encontrada' }
  if (caja.estado === 'Cerrada') return { code: 400, message: 'La caja ya está cerrada' }

  try {
    const movimientos = await Movimiento.findAll({
      where: { CajaId: id },
    })

    let ingresos = 0
    let egresos = 0
    let sumaInyeccionesBancos = 0 // <-- Nueva variable para tu campo totalInyecciones

    movimientos.forEach((m) => {
      const valor = parseFloat(m.monto)

      if (m.tipoMovimiento === 'Ingreso') {
        ingresos += valor

        // Verificamos si es categoría 'Bancos' para llenar el campo especial
        if (m.categoria === 'Bancos') {
          sumaInyeccionesBancos += valor
        }
      } else if (m.tipoMovimiento === 'Egreso') {
        egresos += valor
      }
    })

    const saldoSistema = parseFloat(caja.montoApertura) + ingresos - egresos
    const montoContado = parseFloat(data.montoCierre)
    const diferenciaArqueo = montoContado - saldoSistema

    // AQUÍ ACTUALIZAMOS TODOS LOS CAMPOS DE TU MODELO
    await caja.update({
      fechaCierre: new Date(),
      montoEsperado: saldoSistema,
      totalInyecciones: sumaInyeccionesBancos, // <-- AHORA SÍ LO GUARDAMOS
      montoCierre: montoContado,
      diferencia: diferenciaArqueo,
      estado: 'Cerrada',
      observaciones:
        data.observaciones ||
        `Cierre procesado. Diferencia detectada: $${diferenciaArqueo.toFixed(2)}`,
    })

    return {
      code: 200,
      message: 'Caja cerrada y arqueada con éxito',
      resumen: {
        apertura: parseFloat(caja.montoApertura),
        totalIngresos: ingresos,
        totalInyeccionesBancos: sumaInyeccionesBancos, // Lo incluimos en el resumen para el frontend
        totalEgresos: egresos,
        esperado: saldoSistema,
        contado: montoContado,
        diferencia: diferenciaArqueo,
      },
    }
  } catch (error) {
    console.error('Error en servicio cerrarCaja:', error)
    return { code: 500, message: 'Error interno al procesar el cierre' }
  }
}

const registrarInyeccionBanco = async (data) => {
  const { monto, descripcion, CajaId } = data

  // Iniciamos transacción para que no haya errores de "plata fantasma"
  const t = await sq.transaction()

  try {
    // 1. Verificamos que la caja exista y esté abierta
    const caja = await Caja.findOne({
      where: { id: CajaId, estado: 'Abierta' },
      transaction: t,
    })

    if (!caja) {
      await t.rollback()
      return { code: 400, message: 'No existe una caja abierta para esta operación' }
    }

    // 2. Creamos el Movimiento de Ingreso (Categoría Bancos)
    const nuevoMovimiento = await Movimiento.create(
      {
        monto: parseFloat(monto),
        tipoMovimiento: 'Ingreso',
        categoria: 'Bancos',
        descripcion: descripcion || 'Inyección de capital desde Bancos',
        CajaId,
        idReferencia: null, // Es un ingreso manual
      },
      { transaction: t }
    )

    // 3. ACTUALIZAMOS EL SALDO ACTUAL (Aquí es donde la magia ocurre)
    // Sumamos el monto al saldoActual que ya tiene la caja en DB
    await caja.increment('saldoActual', {
      by: parseFloat(monto),
      transaction: t,
    })

    // Confirmamos los cambios
    await t.commit()

    // Traemos la caja actualizada para devolverla al frontend
    const cajaActualizada = await Caja.findByPk(CajaId)

    return {
      code: 201,
      message: 'Dinero de bancos ingresado a caja correctamente',
      movimiento: nuevoMovimiento,
      caja: cajaActualizada,
    }
  } catch (error) {
    if (t) await t.rollback()
    console.error('Error en registrarInyeccionBanco:', error.message)
    return { code: 500, message: 'Error interno al registrar el ingreso de banco' }
  }
}

export { cerrarCaja, registrarInyeccionBanco }
