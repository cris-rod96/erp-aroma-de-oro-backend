import { Caja, Movimiento, Producto, sq } from '../../libs/db.js'
import { backupUtils } from '../../utils/index.utils.js'

const cerrarCaja = async (id, data) => {
  const caja = await Caja.findByPk(id)

  if (!caja) return { code: 404, message: 'Caja no encontrada' }
  if (caja.estado === 'Cerrada') return { code: 400, message: 'La caja ya está cerrada' }

  try {
    const movimientos = await Movimiento.findAll({
      where: { CajaId: id },
    })

    let ingresosFisicos = 0
    let egresosFisicos = 0
    let sumaInyeccionesBancos = 0
    let movimientosVirtuales = 0

    movimientos.forEach((m) => {
      const valor = parseFloat(m.monto)
      const desc = m.descripcion?.toUpperCase() || ''

      const esVirtual =
        desc.includes('BANCO') || desc.includes('CHEQUE') || desc.includes('TRANSFERENCIA')

      if (m.tipoMovimiento === 'Ingreso') {
        if (!esVirtual) {
          ingresosFisicos += valor
        } else {
          movimientosVirtuales += valor
          if (m.categoria === 'Bancos') {
            sumaInyeccionesBancos += valor
          }
        }
      } else if (m.tipoMovimiento === 'Egreso') {
        if (!esVirtual) {
          egresosFisicos += valor
        } else {
          movimientosVirtuales -= valor
        }
      }
    })

    // --- CÁLCULOS DE SALDO ---
    const saldoBruto = parseFloat(caja.montoApertura) + ingresosFisicos - egresosFisicos
    const saldoSistemaFisico = Number(saldoBruto.toFixed(2))
    const montoContado = parseFloat(data.montoCierre)
    const diferenciaArqueo = Number((montoContado - saldoSistemaFisico).toFixed(2))

    // 1. ACTUALIZACIÓN DEL MODELO EN DB (Primero aseguramos el cierre)
    await caja.update({
      fechaCierre: new Date(),
      montoEsperado: saldoSistemaFisico,
      totalInyecciones: sumaInyeccionesBancos,
      montoCierre: montoContado,
      diferencia: diferenciaArqueo,
      estado: 'Cerrada',
      observaciones:
        data.observaciones || `Cierre Aroma de Oro. Diferencia: $${diferenciaArqueo.toFixed(2)}`,
    })

    // 2. EJECUCIÓN DEL BACKUP (Omitimos Cloudinary/DB por ahora, solo local)
    // Lo envolvemos en un try independiente para que un error de pg_dump no tumbe el cierre de caja
    let backupPath = null
    try {
      console.log('--- Iniciando proceso de backup de seguridad ---')
      backupPath = await backupUtils.generarBackup(id)
    } catch (backupError) {
      console.error('⚠️ El cierre de caja fue exitoso, pero el BACKUP FALLÓ:', backupError.message)
      // Aquí podrías enviar un log a un servicio externo si quisieras
    }

    return {
      code: 200,
      message: 'Caja cerrada y arqueada con éxito',
      resumen: {
        apertura: parseFloat(caja.montoApertura),
        totalIngresosEfectivo: Number(ingresosFisicos.toFixed(2)),
        totalEgresosEfectivo: Number(egresosFisicos.toFixed(2)),
        operacionesBancarias: Number(movimientosVirtuales.toFixed(2)),
        esperado: saldoSistemaFisico,
        contado: montoContado,
        diferencia: diferenciaArqueo,
        backupLocal: backupPath ? 'Generado exitosamente' : 'Fallido',
      },
    }
  } catch (error) {
    console.error('Error crítico en servicio cerrarCaja:', error)
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
const registrarVentaRapida = async (data) => {
  const t = await sq.transaction()
  try {
    const { monto, descripcion, CajaId, ProductoId, cantidad } = data
    const caja = await Caja.findByPk(CajaId)
    if (!caja) return { code: 400, message: 'No se encontró la caja' }
    if (caja.estado === 'Cerrada')
      return { code: 400, message: 'La caja ya se encuentra cerrada y con cuadre.' }
    if (monto > caja.saldoActual) return { code: 400, message: 'Fondos insuficientes' }

    const nuevoMovimiento = await Movimiento.create(
      {
        tipoMovimiento: 'Ingreso',
        categoria: 'Venta',
        monto,
        descripcion: `VENTA RÁPIDA: ${descripcion}`,
        CajaId,
        fecha: new Date(),
      },
      { transaction: t }
    )

    const producto = await Producto.findByPk(ProductoId)
    if (!producto) return { code: 400, message: 'Producto no encontrado' }

    if (parseFloat(producto.stock) < parseFloat(cantidad))
      return {
        code: 400,
        message: `Stock insuficiente. Disponible ${producto.stock} ${producto.unidadMedida}`,
      }

    producto.stock = parseFloat(producto.stock) - parseFloat(cantidad)
    await producto.save({ transaction: t })

    caja.saldoActual = parseFloat(caja.saldoActual) + parseFloat(monto)
    await caja.save({ transaction: t })

    await t.commit()
    return { code: 201, message: 'Venta y egreso de bodega registrados con éxito', caja }
  } catch (error) {
    await t.rollback()
    return {
      code: 500,
      message: 'Error interno el procesar venta rápida',
    }
  }
}

const reAperturarCaja = async (id) => {
  const caja = await Caja.findByPk(id)
  if (!caja) return { code: 400, message: 'No se encontró la caja' }
  if (caja.estado === 'Abierta')
    return { code: 400, message: 'La caja actualmente se encuentra abierta' }

  await caja.update({
    fechaCierre: null,
    estado: 'Abierta',
    montoEsperado: 0.0,
    montoCierre: 0.0,
    diferencia: 0.0,
    observaciones: null,
  })

  const cajaActualizada = await Caja.findByPk(id)
  return {
    code: 200,
    message: 'La caja fue abierta nuevamente',
    caja: cajaActualizada,
  }
}

export { cerrarCaja, registrarInyeccionBanco, registrarVentaRapida, reAperturarCaja }
