import {
  obtenerCajaAbierta,
  listarCerradas,
  listarPorRango,
  listarTodas,
} from './get.controller.js'
import { abrirCaja } from './post.controller.js'
import { cerrarCaja, postInyeccionBanco } from './update.controller.js'

export default {
  abrirCaja,
  obtenerCajaAbierta,
  listarCerradas,
  listarTodas,
  listarPorRango,
  cerrarCaja,
  postInyeccionBanco,
}
