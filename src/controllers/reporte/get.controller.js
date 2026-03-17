import { reporteService } from '../../services/index.services.js'

const listarTodos = async (req, res) => {
  try {
    const { code, reportes } = await reporteService.listarTodos()
    res.status(code).json({ reportes })
  } catch (error) {
    res.status(500).json({
      message: 'Error interno en el servidor. Intente de nuevo',
    })
  }
}

export { listarTodos }
