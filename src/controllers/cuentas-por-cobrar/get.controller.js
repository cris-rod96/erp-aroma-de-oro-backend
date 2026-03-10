import { cuentasPorCobrarService } from '../../services/index.services.js'

const listarTodas = async (req, res) => {
  try {
    const { code, cuentasPorCobrar } = await cuentasPorCobrarService.listarTodas()

    res.status(code).json({
      cuentasPorCobrar,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error interno en el servidor. Intente de nuevo.',
    })
  }
}
const obtenerInformacion = async (req, res) => {
  try {
    const { id } = req.params
    const { code, message, cuenta } = await cuentasPorCobrarService.obtenerInformacion(id)

    res.status(code).json(
      cuenta
        ? {
            cuentaPorCobrar: cuenta,
          }
        : {
            message,
          }
    )
  } catch (error) {
    res.status(500).json({
      message: 'Error interno en el servidor. Intente de nuevo.',
    })
  }
}

export { listarTodas, obtenerInformacion }
