import { borrarUsuario } from './delete.controller.js'
import { listarUsuarios, listarUsuarioPorClave } from './get.controller.js'
import { agregarUsuario } from './post.controller.js'
import {
  actualizarClave,
  actualizarInformacion,
  recuperarClave,
  recuperarUsuario,
} from './update.controller.js'

export default {
  agregarUsuario,
  actualizarClave,
  actualizarInformacion,
  borrarUsuario,
  listarUsuarios,
  listarUsuarioPorClave,
  recuperarUsuario,
  recuperarClave,
}
