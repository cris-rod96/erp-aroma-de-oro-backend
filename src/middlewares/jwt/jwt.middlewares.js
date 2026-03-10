import { request, response } from 'express'
import { Usuario } from '../../libs/db.js'
import { jwtUtils } from '../../utils/index.utils.js'

const verificarToken = async (req = request, res = response, next) => {
  try {
    const token = req.header('x-token')

    if (!token)
      return res.status(401).json({
        message: 'Petición denegada. No existe token en la petición',
      })

    const { id } = jwtUtils.validarToken(token)
    if (!id)
      return res.status(401).json({
        message: 'Petición denegada. Token inválido',
      })

    const usuario = await Usuario.findOne({
      where: {
        id,
      },
    })

    if (!usuario || !usuario.estaActivo)
      return res.status(401).json({
        message: 'Petición denegada. Usuario no válido',
      })

    if (!usuario.esAdministrador) {
      return res.status(401).json({
        message: 'Petición denegada. No eres administrador',
      })
    }

    next()
  } catch (error) {
    res.status(401).json({
      message: 'Petición denegada. Token no válido.',
    })
  }
}

export default {
  verificarToken,
}
