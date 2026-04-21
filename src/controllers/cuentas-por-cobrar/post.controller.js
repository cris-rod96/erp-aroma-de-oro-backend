import { cuentasPorCobrarService } from '../../services/index.services.js'

const crearPrestamoTercero = async (req, res) => {
  try {
    const data = req.body
    const { code, message, caja } = await cuentasPorCobrarService.crearPrestamoTercero(data)

    res.status(code).json(caja ? { caja, message } : { message })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'Error crítico en el servidor.',
    })
  }
}

export { crearPrestamoTercero }
