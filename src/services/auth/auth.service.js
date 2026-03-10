import { Usuario } from '../../libs/db.js'
import { bcryptUtils, jwtUtils } from '../../utils/index.utils.js'

const iniciarSesion = async (cedula, clave) => {
  const usuario = await Usuario.findOne({
    where: {
      cedula,
    },
  })

  if (!usuario)
    return {
      code: 404,
      message: 'Error al iniciar sesión. Usuario no encontrado.',
    }

  if (!usuario.estaActivo) {
    return {
      code: 400,
      message: 'Error al iniciar sesión. Usuario dado de baja.',
    }
  }

  const { clave: claveCifrada, ...usuarioData } = usuario.dataValues

  const isValid = await bcryptUtils.comparePassword(clave, claveCifrada)

  if (!isValid) {
    return {
      code: 401,
      message: 'Error al iniciar sesión. Credenciales incorrectas',
    }
  }

  const token = jwtUtils.generarToken({
    id: usuarioData.id,
    cedula: usuarioData.cedula,
    nombresCompletos: usuarioData.nombresCompletos,
    esAdministrador: usuarioData.esAdministrador,
  })

  return {
    code: 200,
    data: usuarioData,
    token,
  }
}

export default {
  iniciarSesion,
}
