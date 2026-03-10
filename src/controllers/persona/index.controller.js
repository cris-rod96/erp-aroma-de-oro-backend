import { borrarPersona } from './delete.controller.js'
import {
  listarPersonas,
  listarPersonaPorClave,
  listarTrabajadores,
  listarCompradores,
  listarProductores,
} from './get.controller.js'
import { registrarPersona } from './post.controller.js'
import { actualizarPersona } from './update.controller.js'

export default {
  listarPersonas,
  listarPersonaPorClave,
  registrarPersona,
  borrarPersona,
  actualizarPersona,
  listarTrabajadores,
  listarCompradores,
  listarProductores,
}
