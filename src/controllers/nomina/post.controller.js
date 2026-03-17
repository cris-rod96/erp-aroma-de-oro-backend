import { nominaService } from '../../services/index.services.js'

const pagarJornal = async (req, res) => {
  try {
    const data = req.body
    const { code, message, caja } = await nominaService.pagarJornal(data)
    res.status(code).json(
      caja
        ? { caja, message }
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

export { pagarJornal }
