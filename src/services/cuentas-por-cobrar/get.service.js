import { CuentasPorCobrar } from '../../libs/db.js'

const listarTodas = async () => {
  const cuentasPorCobrar = await CuentasPorCobrar.findAll()
  return {
    code: 200,
    cuentasPorCobrar,
  }
}

const obtenerInformacion = async (id) => {
  const cuenta = await CuentasPorCobrar.findOne({
    where: {
      id,
    },
  })

  if (!cuenta) return { code: 404, message: 'Cuenta no encontrada' }

  return {
    code: 200,
    cuenta,
  }
}

export { listarTodas, obtenerInformacion }
