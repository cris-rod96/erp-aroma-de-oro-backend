import { AbonosCuentasPorCobrar, CuentasPorCobrar } from '../../libs/db.js'

const listarPorCxc = async (id) => {
  const cxc = await CuentasPorCobrar.findOne({
    where: {
      id,
    },
    order: [['createdAt', 'DESC']],
  })

  if (!cxc) return { code: 404, message: 'No existe la cuenta por cobrar' }

  const abonos = await AbonosCuentasPorCobrar.findAll({
    where: {
      CuentaPorCobrarId: id,
    },
  })

  return {
    code: 200,
    abonos,
  }
}

export { listarPorCxc }
