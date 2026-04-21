import { listarCobradas, listarPendientes, listarTodas, obtenerInformacion } from './get.service.js'
import { crearPrestamoTercero } from './post.service.js'
import { registrarCobro } from './update.service.js'

export default {
  listarTodas,
  listarPendientes,
  listarCobradas,
  obtenerInformacion,
  registrarCobro,
  crearPrestamoTercero,
}
