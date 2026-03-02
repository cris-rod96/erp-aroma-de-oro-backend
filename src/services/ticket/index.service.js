import {
  listarInformacion,
  listarPorClave,
  listarTodos,
} from "./get.service.js";
import { crearTicket } from "./post.service.js";
import { actualizarInformacion } from "./update.service.js";

export default {
  listarInformacion,
  listarPorClave,
  listarTodos,
  crearTicket,
  actualizarInformacion,
};
