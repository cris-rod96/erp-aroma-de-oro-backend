import { Reporte } from '../../libs/db.js'

const listarTodos = async () => {
  const reportes = await Reporte.findAll()

  return {
    code: 200,
    reportes,
  }
}

export { listarTodos }
