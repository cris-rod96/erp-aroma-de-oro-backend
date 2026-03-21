import { Op } from 'sequelize'
import { Caja, Liquidacion, Movimiento, Nomina, Persona, Venta } from '../../libs/db.js'

const listarPorCaja = async (CajaId) => {
  const caja = await Caja.findOne({ where: { id: CajaId } })
  if (!caja) return { code: 404, message: 'Caja no encontrada' }

  const movimientos = await Movimiento.findAll({
    where: {
      CajaId,
    },
  })
  return { code: 200, movimientos }
}

const listarPorClave = async (clave, valor) => {
  const movimientos = await Movimiento.findAll({
    where: {
      [clave]: valor,
    },
  })

  return { code: 200, movimientos }
}

const listarPorRango = async (fechaInicio, fechaFin) => {
  const movimientos = await Movimiento.findAll({
    where: {
      fecha: {
        [Op.between]: [fechaInicio, fechaFin],
      },
    },
  })

  return { code: 200, movimientos }
}

const listarTodos = async () => {
  const movimientos = await Movimiento.findAll({
    include: [
      { model: Liquidacion, as: 'detalleCompra', required: false },
      { model: Venta, as: 'detalleVenta', required: false },
      { model: Nomina, as: 'detalleNomina', required: false, include: [Persona] },
      { model: Caja },
    ],
  })

  return {
    code: 200,
    movimientos,
  }
}

export { listarPorCaja, listarPorClave, listarPorRango, listarTodos }
