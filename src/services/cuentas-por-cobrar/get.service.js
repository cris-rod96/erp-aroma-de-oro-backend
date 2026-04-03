import {
  AbonosCuentasPorCobrar,
  Anticipo,
  Caja,
  CuentasPorCobrar,
  Persona,
  Prestamo,
  Producto,
  Usuario,
  Venta,
} from '../../libs/db.js'

const listarTodas = async () => {
  const cuentasPorCobrar = await CuentasPorCobrar.findAll({
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: Venta,
        include: [Persona, Producto, Usuario, Caja],
      },
      {
        model: AbonosCuentasPorCobrar,
      },
      {
        model: Anticipo,
        include: [Persona, Usuario, Caja],
      },
      {
        model: Prestamo,
        include: [Persona],
      },
    ],
  })
  return {
    code: 200,
    cuentasPorCobrar,
  }
}

const listarPendientes = async () => {
  const cuentasPorCobrar = await CuentasPorCobrar.findAll({
    where: {
      estado: 'Pendiente',
    },
    include: [Venta],
  })
  return {
    code: 200,
    cuentasPorCobrar,
  }
}

const listarCobradas = async () => {
  const cuentasPorCobrar = await CuentasPorCobrar.findAll({
    where: {
      estado: 'Cobrado',
    },
    include: [Venta],
  })
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

export { listarTodas, obtenerInformacion, listarPendientes, listarCobradas }
