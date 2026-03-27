import { Router } from 'express'
import { usuarioControllers } from '../../controllers/index.controllers.js'
import { jwtMiddlewares, validatorMiddlewares } from '../../middlewares/index.middlewares.js'
import { validatorUsuario } from '../../validations/index.validations.js'

const usuarioRouter = Router()

usuarioRouter.get(
  '/todos',
  jwtMiddlewares.verificarToken,
  jwtMiddlewares.rolesAdmitidos('Administrador', 'Contador'),
  usuarioControllers.listarUsuarios
)
usuarioRouter.get(
  '/buscar-usuario',
  jwtMiddlewares.verificarToken,
  jwtMiddlewares.rolesAdmitidos('Administrador', 'Contador'),
  usuarioControllers.listarUsuarioPorClave
)

usuarioRouter.post(
  '/agregar',
  jwtMiddlewares.verificarToken,
  jwtMiddlewares.rolesAdmitidos('Administrador', 'Contador'),
  validatorUsuario.validacionCrearUsuario,
  validatorMiddlewares.validarDatos,
  usuarioControllers.agregarUsuario
)

usuarioRouter.delete(
  '/borrar-usuario/:id',
  jwtMiddlewares.verificarToken,
  jwtMiddlewares.rolesAdmitidos('Administrador', 'Contador'),
  usuarioControllers.borrarUsuario
)

usuarioRouter.patch(
  '/actualizar-informacion/:id',
  jwtMiddlewares.verificarToken,
  jwtMiddlewares.rolesAdmitidos('Administrador', 'Contador'),
  usuarioControllers.actualizarInformacion
)

usuarioRouter.patch(
  '/actualizar-clave/:id',
  jwtMiddlewares.verificarToken,
  jwtMiddlewares.rolesAdmitidos('Administrador', 'Contador'),
  usuarioControllers.actualizarClave
)

usuarioRouter.patch(
  '/recuperar-usuario/:id',
  jwtMiddlewares.verificarToken,
  jwtMiddlewares.rolesAdmitidos('Administrador', 'Contador'),
  usuarioControllers.recuperarUsuario
)

usuarioRouter.patch('/recuperar-clave', usuarioControllers.recuperarClave)

export default usuarioRouter
