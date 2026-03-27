import { Usuario } from '../../libs/db.js'
import { usuarioService } from '../../services/index.services.js'

const actualizarInformacion = async (req, res) => {
  try {
    const { id } = req.params
    const data = req.body
    const { code, message } = await usuarioService.actualizarInformacion(id, data)
    res.status(code).json({ message })
  } catch (error) {
    res.status(500).json({
      message: 'Error interno en el servidor. Intente de nuevo',
    })
  }
}

const actualizarClave = async (req, res) => {
  const { id } = req.params // El ID del usuario que se quiere cambiar (UUID)
  const { clave } = req.body // La nueva clave
  const usuarioLogueado = req.usuario // El que viene del middleware (el Admin o el dueño)

  try {
    // Validación de UUIDs (comparación simple de strings)
    const esDuenio = id === usuarioLogueado.id
    const esAdmin = usuarioLogueado.rol === 'Administrador'

    if (!esDuenio && !esAdmin) {
      return res.status(403).json({
        message: 'Permisos insuficientes para realizar esta acción',
      })
    }

    // Delegamos toda la lógica de actualización al servicio
    const { code, message } = await usuarioService.actualizarClave(id, clave)

    return res.status(code).json({ message })
  } catch (error) {
    console.error(error) // Útil para debugear en consola
    return res.status(500).json({
      message: 'Error interno en el servidor. Intente de nuevo',
    })
  }
}

const recuperarUsuario = async (req, res) => {
  try {
    const { id } = req.params
    if (!id) return res.status(400).json({ message: 'La ID es obligatoria' })
    const { code, message } = await usuarioService.recupearUsuario(id)
    res.status(code).json({ message })
  } catch (error) {
    res.status(500).json({
      message: 'Error crítico en el servidor. Intente de nuevo',
    })
  }
}

const recuperarClave = async (req, res) => {
  try {
    const { correo } = req.body
    const { code, message } = await usuarioService.recuperarClave(correo)
    res.status(code).json({ message })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'Error crítico en el servidor. Intente de nuevo',
    })
  }
}

export { actualizarInformacion, actualizarClave, recuperarUsuario, recuperarClave }
