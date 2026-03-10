import { productoService } from '../../services/index.services.js'

const crearProducto = async (req, res) => {
  try {
    const data = req.body
    const { code, message } = await productoService.crearProducto(data)
    res.status(code).json({
      message,
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'Error interno en el servidor. Intente de nuevo.',
    })
  }
}

export { crearProducto }
