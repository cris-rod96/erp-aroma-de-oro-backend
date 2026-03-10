import { Persona } from '../../libs/db.js'

const listarPersonas = async () => {
  const personas = await Persona.findAll()
  return {
    code: 200,
    personas,
  }
}

const listarProductores = async () => {
  const productores = await Persona.findAll({
    where: {
      tipo: 'Productor',
      estaActivo: true,
    },
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
  })

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

export {
  listarPersonas,
  listarPersonaPorClave,
  listarProductores,
  listarCompradores,
  listarTrabajadores,
}
