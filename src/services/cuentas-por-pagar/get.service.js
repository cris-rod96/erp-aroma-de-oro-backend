import { CuentasPorPagar } from '../../libs/db.js'

const listarTodas = async () => {
  const cuentasPorPagar = await CuentasPorPagar.findAll()
  return {
    code: 200,
    cuentasPorPagar,
  }
}

const obtenerInformacion = async (id) => {
  const cuentaPorPagar = await CuentasPorPagar.findOne({
    where: {
      id,
    },
  })

  if (!cuentaPorPagar) return { code: 404, message: 'Cuenta no encontrada' }

  return {
    code: 200,
    cuentaPorPagar,
  }
}

export { listarTodas, obtenerInformacion }
