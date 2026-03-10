import { empresaService } from '../../services/index.services.js'

const crearEmpresa = async (req, res) => {
  try {
    const data = req.body
    console.log(data)
    const { code, empresa } = await empresaService.crearEmpresa(data)
    res.status(code).json({
      empresa,
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'Error interno en el servidor. Intente más tarde.',
    })
  }
}

export { crearEmpresa }
