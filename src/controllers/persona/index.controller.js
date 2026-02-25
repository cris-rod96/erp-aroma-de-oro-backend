import { borrarPersona } from "./delete.controller.js";
import { listarPersonas, listarPersonaPorClave } from "./get.controller.js";
import { registrarPersona } from "./post.controller.js";
import { actualizarPersona } from "./update.controller.js";

export default {
  listarPersonas,
  listarPersonaPorClave,
  registrarPersona,
  borrarPersona,
  actualizarPersona,
};
