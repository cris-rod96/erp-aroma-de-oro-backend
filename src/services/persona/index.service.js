import { borrarPersona } from './delete.service.js'
import {
  listarCompradores,
  listarPersonaPorClave,
  listarPersonas,
  listarProductores,
  listarTrabajadores,
} from './get.service.js'
import { registrarPersona } from './post.service.js'
import { actualizarPersona } from './update.service.js'

export default {
  registrarPersona,
  listarPersonas,
  listarPersonaPorClave,
  listarCompradores,
  listarTrabajadores,
  listarProductores,
  borrarPersona,
  actualizarPersona,
}
