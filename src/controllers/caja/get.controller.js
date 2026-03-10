import { cajaService } from '../../services/index.services.js'

const listarAbiertas = async (req, res) => {
  try {
    const { code, cajas } = await cajaService.listarAbiertas()
    res.status(code).json({ cajas })
  } catch (error) {
    res.status(500).json({
      message: 'Error interno en el servidor. Intente de nuevo.',
    })
  }
}

const listarCerradas = async (req, res) => {
  try {
    const { code, cajas } = await cajaService.listarCerradas()
    res.status(code).json({ cajas })
  } catch (error) {
    res.status(500).json({
      message: 'Error interno en el servidor. Intente de nuevo.',
    })
  }
}
const listarPorRango = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query
    const { code, message, cajas } = await cajaService.listarPorRango(fechaInicio, fechaFin)

    res.status(code).json(cajas ? { cajas } : { message })
  } catch (error) {
    res.status(500).json({
      message: 'Error interno en el servidor. Intente de nuevo.',
    })
  }
}
const listarTodas = async (req, res) => {
  try {
    const { code, cajas } = await cajaService.listarTodas()
    res.status(code).json({ cajas })
  } catch (error) {
    console.log('Aqui: ', error.message)
    res.status(500).json({
      message: 'Error interno en el servidor. Intente de nuevo.',
    })
  }
}

export { listarAbiertas, listarCerradas, listarPorRango, listarTodas }
