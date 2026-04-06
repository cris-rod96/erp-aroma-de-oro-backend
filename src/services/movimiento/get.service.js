import { Op } from 'sequelize'
import {
  Anticipo,
  Caja,
  DetalleLiquidacion,
  Gasto,
  Liquidacion,
  Movimiento,
  Nomina,
  Persona,
  Prestamo,
  Producto,
  Usuario,
  Venta,
} from '../../libs/db.js'

const listarPorCaja = async (CajaId) => {
  const caja = await Caja.findOne({ where: { id: CajaId } })
  if (!caja) return { code: 404, message: 'Caja no encontrada' }

  const movimientos = await Movimiento.findAll({
    where: {
      CajaId,
    },
    order: [['createdAt', 'DESC']],
  })
  return { code: 200, movimientos }
}

const listarPorClave = async (clave, valor) => {
  const movimientos = await Movimiento.findAll({
    where: {
      [clave]: valor,
    },
    order: [['createdAt', 'DESC']],
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
    order: [['createdAt', 'DESC']],
  })

  return { code: 200, movimientos }
}

const listarTodos = async () => {
  const movimientos = await Movimiento.findAll({
    include: [
      {
        model: Liquidacion,
        as: 'detalleCompra',
        required: false,
        include: [
          {
            model: DetalleLiquidacion,
            include: [Producto],
          },
        ],
      },
      { model: Venta, as: 'detalleVenta', required: false, include: [Producto] },
      { model: Gasto, as: 'detalleGasto', required: false },
      { model: Nomina, as: 'detalleNomina', required: false, include: [Persona] },
      { model: Prestamo, as: 'detallePrestamo', required: false, include: [Persona, Usuario] },
      { model: Anticipo, as: 'detalleAnticipo', required: false, include: [Persona] },
      { model: Caja },
    ],
    order: [['createdAt', 'DESC']],
  })

  return {
    code: 200,
    movimientos,
  }
}

export { listarPorCaja, listarPorClave, listarPorRango, listarTodos }
