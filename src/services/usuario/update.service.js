import { PASSWORD_DEFAULT } from '../../config/envs.js'
import { nodemailerHelper } from '../../helpers/index.helpers.js'
import { Empresa, Usuario } from '../../libs/db.js'
import { bcryptUtils } from '../../utils/index.utils.js'

const actualizarInformacion = async (id, data) => {
  const usuario = await Usuario.findOne({
    where: {
      id,
    },
  })

  if (!usuario) return { code: 404, message: 'Usuario no encontrado' }

  const { telefono, correo } = data

  if (telefono) {
    const otroUsuario = await Usuario.findOne({
      where: {
        telefono,
      },
    })

    if (otroUsuario && otroUsuario.id !== id) {
      return {
        code: 400,
        message: 'Ya existe otro usuario con este teléfono',
      }
    }
  }

  if (correo) {
    const otroUsuario = await Usuario.findOne({
      where: {
        correo,
      },
    })

    if (otroUsuario && otroUsuario.id !== id) {
      return {
        code: 400,
        message: 'Ya existe otro usuario con este correo',
      }
    }
  }

  await usuario.update(data)

  return {
    code: 200,
    message: 'Información del usuario actualizada con éxito',
  }
}

const actualizarClave = async (id, nuevaClave) => {
  // Buscamos al usuario para tener su clave actual y comparar
  const usuario = await Usuario.findByPk(id)

  if (!usuario) {
    return { code: 404, message: 'Usuario no encontrado' }
  }

  // Comparamos la nueva con la que ya tiene en la DB
  const esMismaClave = await bcryptUtils.comparePassword(nuevaClave, usuario.clave)

  if (esMismaClave) {
    return {
      code: 400,
      message: 'La nueva contraseña no puede ser igual a la anterior',
    }
  }

  // Ciframos y guardamos
  const claveCifrada = await bcryptUtils.hashPassword(nuevaClave)

  await usuario.update({
    clave: claveCifrada,
  })

  return {
    code: 200,
    message: 'Contraseña actualizada con éxito',
  }
}

const recupearUsuario = async (id) => {
  const usuario = await Usuario.findByPk(id)
  if (!usuario) return { code: 404, message: 'Usuario no encontrado' }

  if (usuario.estaActivo) return { code: 400, message: 'Usuario ya activo.' }
  await usuario.update({ estaActivo: true })
  return { code: 200, message: 'Usuario recuperado con éxito.' }
}

const recuperarClave = async (correo) => {
  const usuario = await Usuario.findOne({
    where: {
      correo,
    },
  })

  if (!usuario) return { code: 404, message: 'Usuario no encontrado' }
  if (!usuario.estaActivo) return { code: 400, message: 'Usuario no disponible' }

  const empresa = await Empresa.findOne()
  const hashContraseña = await bcryptUtils.hashPassword(PASSWORD_DEFAULT)

  await usuario.update({
    clave: hashContraseña,
  })

  nodemailerHelper.recuperarContraseña(
    correo,
    usuario.nombresCompletos,
    PASSWORD_DEFAULT,
    empresa.nombre
  )

  return { code: 200, message: 'Nueva contraseña enviada al correo registrado' }
}
export { actualizarInformacion, actualizarClave, recupearUsuario, recuperarClave }
