import { borrarUsuario } from "./delete.service.js";
import { listarUsuarios, listarUsuarioPorClave } from "./get.service.js";
import { agregarUsuario } from "./post.service.js";
import { actualizarClave, actualizarInformacion } from "./update.service.js";

export default {
  listarUsuarioPorClave,
  listarUsuarios,
  agregarUsuario,
  borrarUsuario,
  actualizarClave,
  actualizarInformacion,
};
