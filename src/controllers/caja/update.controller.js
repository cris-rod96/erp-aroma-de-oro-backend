import { cajaService } from '../../services/index.services.js'

// 1. CONTROLADOR PARA CERRAR CAJA (ARQUEO FINAL)
const cerrarCaja = async (req, res) => {
  try {
    const { id } = req.params
    const { montoCierre, observaciones } = req.body

    if (montoCierre === undefined || montoCierre === null) {
      return res.status(400).json({
        message: 'El monto contado físicamente es obligatorio para cerrar la caja.',
      })
    }

    const { code, message, resumen } = await cajaService.cerrarCaja(id, {
      montoCierre: parseFloat(montoCierre),
      observaciones: observaciones || 'Cierre de caja estándar',
    })

    return res.status(code).json(resumen ? { message, resumen } : { message })
  } catch (error) {
    console.error('Error en Controlador CerrarCaja:', error.message)
    return res.status(500).json({
      message: 'Error interno en el servidor al intentar cerrar la caja.',
    })
  }
}

// 2. CONTROLADOR PARA INYECCIÓN DESDE BANCOS (EL QUE RECIBE EL MODAL)
const postInyeccionBanco = async (req, res) => {
  try {
    const { monto, descripcion, CajaId } = req.body

    // Validaciones básicas de entrada
    if (!monto || monto <= 0) {
      return res.status(400).json({ message: 'Debe ingresar un monto válido mayor a 0.' })
    }

    if (!CajaId) {
      return res.status(400).json({ message: 'El ID de la caja es obligatorio.' })
    }

    // Llamamos al nuevo método del servicio
    const { code, message, movimiento, caja } = await cajaService.registrarInyeccionBanco({
      monto: parseFloat(monto),
      descripcion,
      CajaId,
    })

    // Retornamos el movimiento creado y la caja con el saldoActual ya actualizado
    return res.status(code).json(movimiento ? { message, movimiento, caja } : { message })
  } catch (error) {
    console.error('Error en Controlador postInyeccionBanco:', error.message)
    return res.status(500).json({
      message: 'Error interno en el servidor al registrar el ingreso de banco.',
    })
  }
}

const registrarVentaRapida = async (req, res) => {
  try {
    const data = req.body
    const { code, message, caja } = await cajaService.registrarVentaRapida(data)
    res.status(code).json(caja ? { caja, message } : { message })
  } catch (error) {
    const msg = error.message
    res.status(500).json({ message: msg })
  }
}

export { cerrarCaja, postInyeccionBanco, registrarVentaRapida }
