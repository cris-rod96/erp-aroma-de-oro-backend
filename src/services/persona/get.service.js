import { col, fn, literal, Op, where } from 'sequelize'
import { CuentasPorPagar, DetalleLiquidacion, Liquidacion, Persona, Venta } from '../../libs/db.js'

const listarPersonas = async () => {
  const personas = await Persona.findAll({
    order: [['createdAt', 'DESC']],
  })
  return {
    code: 200,
    personas,
  }
}

const listarProductores = async () => {
  const productores = await Persona.findAll({
    where: {
      tipo: 'Productor',
    },
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: Liquidacion,
        include: [DetalleLiquidacion, CuentasPorPagar],
      },
    ],
  })

  return {
    code: 200,
    productores,
  }
}

const listarCompradores = async () => {
  const compradores = await Persona.findAll({
    where: {
      tipo: 'Comprador',
    },
    order: [['createdAt', 'DESC']],
  })

  console.log(compradores)

  return {
    code: 200,
    compradores,
  }
}

const listarTrabajadores = async () => {
  const trabajadores = await Persona.findAll({
    where: {
      tipo: 'Trabajador',
    },

    order: [['createdAt', 'DESC']],
  })

  return {
    code: 200,
    trabajadores,
  }
}

const listarPersonaPorClave = async (key, value) => {
  const persona = await Persona.findOne({
    where: {
      [key]: value,
    },
  })
  return persona
    ? {
        code: 200,
        persona,
      }
    : {
        code: 404,
        message: 'Persona no encontrada',
      }
}

const listarProximosCumples = async (fecha = new Date()) => {
  const dia = fecha.getDate()
  const mes = fecha.getMonth() + 1

  // 1. Convertimos la fecha a formato ISO (YYYY-MM-DD)
  const fechaIso = fecha.toISOString().split('T')[0]

  const trabajadores = await Persona.findAll({
    where: {
      tipo: 'Trabajador',
      estaActivo: true,
      [Op.and]: [
        // 2. Usamos literal dentro de fn para evitar que Sequelize ponga comillas de más
        where(fn('EXTRACT', literal('DAY FROM "fechaNacimiento"')), dia),
        where(fn('EXTRACT', literal('MONTH FROM "fechaNacimiento"')), mes),
      ],
    },
    attributes: [
      'id',
      'nombreCompleto',
      'fechaNacimiento',
      // 3. Referencia correcta a la columna con comillas dobles y fecha limpia
      [literal(`EXTRACT(YEAR FROM AGE('${fechaIso}', "fechaNacimiento"))`), 'edadCumplida'],
    ],
  })

  return { code: 200, trabajadores }
}

export {
  listarPersonas,
  listarPersonaPorClave,
  listarProductores,
  listarCompradores,
  listarTrabajadores,
  listarProximosCumples,
}
