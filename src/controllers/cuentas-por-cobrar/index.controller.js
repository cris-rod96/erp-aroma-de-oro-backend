import {
  listarCobradas,
  listarPendientes,
  listarTodas,
  obtenerInformacion,
} from './get.controller.js'
import { crearPrestamoTercero } from './post.controller.js'
import { registrarCobro } from './update.controller.js'

export default {
  listarTodas,
  listarPendientes,
  listarCobradas,
  obtenerInformacion,
  registrarCobro,
  crearPrestamoTercero,
}
