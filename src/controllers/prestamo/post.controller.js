import { prestamoService } from '../../services/index.services.js'

const crearPrestamo = async (req, res) => {
  try {
    const data = req.body
    const { code, message, caja } = await prestamoService.crearPrestamo(data)
    res.status(code).json(
      caja
        ? {
            message,
            caja,
          }
        : { message }
    )
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'Error interno en el servidor. Intente de nuevo',
    })
  }
}

const prestamoTerceros = async (req, res) => {
  try {
    const data = req.body
    const { code, message, caja } = await prestamoService.prestamoTerceros(data)
    res.status(code).json(
      caja
        ? {
            message,
            caja,
          }
        : { message }
    )
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'Error interno en el servidor. Intente de nuevo',
    })
  }
}

export { crearPrestamo, prestamoTerceros }
