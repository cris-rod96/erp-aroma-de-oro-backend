import { abonosPorCobrarService } from '../../services/index.services.js'

const listarPorCxc = async (req, res) => {
  try {
    const { id } = req.params
    const { code, abonos, message } = await abonosPorCobrarService.listarPorCxc(id)
    res.status(code).json(abonos ? { abonos } : { message })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: error.message,
    })
  }
}

export { listarPorCxc }
