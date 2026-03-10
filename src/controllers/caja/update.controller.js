import { cajaService } from '../../services/index.services.js'

const cerrarCaja = async (req, res) => {
  try {
    const { id } = req.params

    const { code, message, resumen } = await cajaService.cerrarCaja(id, {
      montoFisico: 5000.0,
    })

    res.status(code).json(resumen ? { message, resumen } : { message })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'Error interno en el servidor. Intente de nuevo.',
    })
  }
}

export { cerrarCaja }
