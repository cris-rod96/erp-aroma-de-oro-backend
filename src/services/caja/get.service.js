import { Op } from 'sequelize'
import {
  Caja,
  DetalleLiquidacion,
  Liquidacion,
  Movimiento,
  Nomina,
  Persona,
  Producto,
  Usuario,
  Venta,
} from '../../libs/db.js'

// Función genérica para evitar repetir código
const responder = (cajas) => ({ code: 200, cajas })

const listarTodas = async () => {
  const cajas = await Caja.findAll({
    order: [['fechaApertura', 'DESC']],
    include: [
      {
        model: Movimiento,
        include: [
          {
            model: Liquidacion,
            as: 'detalleCompra',
            required: false,
            include: [
              {
                model: Persona,
              },
              {
                model: DetalleLiquidacion,
                include: [Producto],
              },
              {
                model: Usuario,
              },
            ],
          },
          {
            model: Venta,
            as: 'detalleVenta',
            required: false,
            include: [Persona, Usuario],
          },

          {
            model: Nomina,
            as: 'detalleNomina',
            required: false,
            include: [Persona, Usuario],
          },
        ],
      },
    ],
  })
  return responder(cajas)
}

const obtenerCajaAbierta = async () => {
  const caja = await Caja.findOne({ where: { estado: 'Abierta' }, include: [Movimiento] })
  return {
    code: 200,
    caja,
  }
}

const listarCerradas = async () => {
  const cajas = await Caja.findAll({ where: { estado: 'Cerrada' } })
  return responder(cajas)
}

const listarPorRango = async (fechaInicio, fechaFin) => {
  // Validamos que existan las fechas para evitar que Sequelize explote
  if (!fechaInicio || !fechaFin) {
    return { code: 400, message: 'Fechas requeridas' }
  }

  const cajas = await Caja.findAll({
    where: {
      fechaApertura: {
        [Op.between]: [fechaInicio, fechaFin],
      },
    },
    order: [['fechaApertura', 'DESC']],
  })

  return responder(cajas)
}

export { obtenerCajaAbierta, listarCerradas, listarPorRango, listarTodas }
