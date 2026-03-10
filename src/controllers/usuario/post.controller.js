import { usuarioService } from '../../services/index.services.js'

const agregarUsuario = async (req, res) => {
  try {
    const data = req.body
    const { code, message } = await usuarioService.agregarUsuario(data)
    res.status(code).json({ message })
  } catch (error) {
    res.status(500).json({
      message: 'Error interno en el servidor. Intente de nuevo',
    })
  }
}

export { agregarUsuario }
