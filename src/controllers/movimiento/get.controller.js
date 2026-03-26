import { movimientoService } from '../../services/index.services.js'

const listarPorCaja = async (req, res) => {
  try {
    const { caja_id } = req.params
    const { code, message, movimientos } = await movimientoService.listarPorCaja(caja_id)
    res.status(code).json(message ? { message } : { movimientos })
  } catch (error) {
    res.status(500).json({
      message: 'Error interno en el servidor. Intente de nuevo.',
    })
  }
}

const listarPorClave = async (req, res) => {
  try {
    const { clave, valor } = req.query
    const { code, movimientos } = await movimientoService.listarPorClave(clave, valor)

    res.status(code).json({ movimientos })
  } catch (error) {
    res.status(500).json({
      message: 'Error interno en el servidor. Intente de nuevo.',
    })
  }
}

const listarPorRango = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query
    const { code, movimientos } = await movimientoService.listarPorRango(fechaInicio, fechaFin)
    res.status(code).json({ movimientos })
  } catch (error) {
    res.status(500).json({
      message: 'Error interno en el servidor. Intente de nuevo.',
    })
  }
}

const listarTodos = async (req, res) => {
  try {
    const { code, movimientos } = await movimientoService.listarTodos()
    res.status(code).json({
      movimientos,
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'Error interno en el servidor. Intente de nuevo.',
    })
  }
}

export { listarPorCaja, listarPorClave, listarPorRango, listarTodos }
