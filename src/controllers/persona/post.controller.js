import { personaService } from '../../services/index.services.js'

const registrarPersona = async (req, res) => {
  try {
    const data = req.body
    const { code, message } = await personaService.registrarPersona(data)
    res.status(code).json({ message })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'Error interno en el servidor. Intente de nuevo',
    })
  }
}

export { registrarPersona }
