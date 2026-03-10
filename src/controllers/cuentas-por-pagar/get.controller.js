import { cuentasPorPagarService } from '../../services/index.services.js'

const listarTodas = async (req, res) => {
  try {
    const { code, cuentasPorPagar } = await cuentasPorPagarService.listarTodas()
    res.status(code).json({ cuentasPorPagar })
  } catch (error) {
    res.status(500).json({
      message: 'Error interno en el servidor. Intente de nuevo',
    })
  }
}

const obtenerInformacion = async (req, res) => {
  try {
    const { id } = req.params
    const { code, message, cuentaPorPagar } = await cuentasPorPagarService.obtenerInformacion(id)

    res.status(code).json(
      cuentaPorPagar
        ? {
            cuentaPorPagar,
          }
        : {
            message,
          }
    )
  } catch (error) {
    res.status(500).json({
      message: 'Error interno en el servidor. Intente de nuevo',
    })
  }
}

export { listarTodas, obtenerInformacion }
