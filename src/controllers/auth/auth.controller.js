import { authService } from '../../services/index.services.js'

const iniciarSesion = async (req, res) => {
  try {
    const { cedula, clave } = req.body

    const { code, message, data, token } = await authService.iniciarSesion(cedula, clave)

    res.status(code).json(
      message
        ? {
            message,
          }
        : {
            usuario: data,
            token,
          }
    )
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'Error interno en el servidor. Intente de nuevo.',
    })
  }
}

export default {
  iniciarSesion,
}
