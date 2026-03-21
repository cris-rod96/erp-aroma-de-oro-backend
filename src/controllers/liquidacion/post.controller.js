import { liquidacionService } from '../../services/index.services.js'

const registrarLiquidacion = async (req, res) => {
  try {
    const data = req.body
    console.log(data)

    const { code, message, error, id, caja } = await liquidacionService.registrarLiquidacion(data)

    res.status(code).json(
      error
        ? {
            error,
            message,
          }
        : {
            message,
            id,
            caja,
          }
    )
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: error.message })
  }
}

export { registrarLiquidacion }
