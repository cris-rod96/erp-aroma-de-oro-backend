import {
  AbonosCuentasPorPagar,
  CuentasPorPagar,
  Liquidacion,
  Persona,
  Ticket,
  Usuario,
} from '../../libs/db.js'

const listarTodas = async () => {
  const cuentasPorPagar = await CuentasPorPagar.findAll({
    order: [['fechaAbono', 'DESC']],

    include: [
      {
        model: Liquidacion,
        include: [Usuario, Persona],
      },
      {
        model: AbonosCuentasPorPagar,
      },
    ],
  })
  return {
    code: 200,
    cuentasPorPagar,
  }
}

const listarPendientes = async () => {
  const cuentasPorPagar = await CuentasPorPagar.findAll({
    where: {
      estado: 'Pendiente',
    },
    include: [
      {
        model: Liquidacion,
        include: [Usuario, Persona],
      },
    ],
  })

  return {
    code: 200,
    cuentasPorPagar,
  }
}

const listarPagadas = async () => {
  const cuentasPorPagar = await CuentasPorPagar.findAll({
    where: {
      estado: 'Pagado',
    },
    include: [
      {
        model: Liquidacion,
        include: [Usuario, Persona],
      },
    ],
  })

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

export { listarTodas, obtenerInformacion, listarPendientes, listarPagadas }
