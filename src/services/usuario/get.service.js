import { Usuario } from '../../libs/db.js'

const listarUsuarios = async () => {
  const usuarios = await Usuario.findAll({
    order: [['createdAt', 'DESC']],
    attributes: {
      exclude: ['clave'],
    },
  })
  return {
    code: 200,
    usuarios,
  }
}

const listarUsuarioPorClave = async (key, value) => {
  const usuario = await Usuario.findOne({
    where: {
      [key]: value,
    },
    attributes: {
      exclude: ['clave'],
    },
  })

  return usuario
    ? {
        code: 200,
        usuario,
      }
    : {
        code: 404,
        message: 'Usuario no encontrado',
      }
}

export { listarUsuarios, listarUsuarioPorClave }
