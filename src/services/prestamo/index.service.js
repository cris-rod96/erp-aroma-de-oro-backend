import { listarPrestamosPendientesPorPersona, listarTodosPrestamos } from './get.service.js'
import { crearPrestamo, prestamoTerceros } from './post.service.js'
import { actualizarPrestamo } from './update.service.js'

export default {
  crearPrestamo,
  listarTodosPrestamos,
  listarPrestamosPendientesPorPersona,
  actualizarPrestamo,
  prestamoTerceros,
}
