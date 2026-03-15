import { ventaService } from '../../services/index.services.js'

const registrarVenta = async (req, res) => {
  try {
    const data = req.body

    // Llamamos al servicio de venta siguiendo tu misma estructura
    const { code, message, error, id } = await ventaService.registrarVenta(data)

    res.status(code).json(
      error
        ? {
            error,
            message,
          }
        : {
            message,
            id,
          }
    )
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export { registrarVenta }
