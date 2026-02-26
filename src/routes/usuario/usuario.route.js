import { Router } from "express";
import { usuarioControllers } from "../../controllers/index.controllers.js";
import {
  jwtMiddlewares,
  validatorMiddlewares,
} from "../../middlewares/index.middlewares.js";
import { validatorUsuario } from "../../validations/index.validations.js";

const usuarioRouter = Router();

usuarioRouter.get(
  "/todos",
  jwtMiddlewares.verificarToken,
  usuarioControllers.listarUsuarios,
);
usuarioRouter.get("/buscar-usuario", usuarioControllers.listarUsuarioPorClave);

usuarioRouter.post(
  "/agregar",
  jwtMiddlewares.verificarToken,
  validatorUsuario.validacionCrearUsuario,
  validatorMiddlewares.validarDatos,
  usuarioControllers.agregarUsuario,
);

usuarioRouter.delete(
  "/borrar-usuario/:id",
  jwtMiddlewares.verificarToken,
  usuarioControllers.borrarUsuario,
);

usuarioRouter.patch(
  "/actualizar-informacion/:id",
  jwtMiddlewares.verificarToken,
  usuarioControllers.actualizarInformacion,
);

usuarioRouter.patch(
  "/actualizar-contraseña/:id",
  jwtMiddlewares.verificarToken,
  usuarioControllers.actualizarClave,
);

export default usuarioRouter;
