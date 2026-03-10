import { Router } from 'express'
import { personaControllers } from '../../controllers/index.controllers.js'
import { jwtMiddlewares, validatorMiddlewares } from '../../middlewares/index.middlewares.js'
import { validatorPersona } from '../../validations/index.validations.js'

const personaRouter = Router()

personaRouter.get('/listar/todos', jwtMiddlewares.verificarToken, personaControllers.listarPersonas)

personaRouter.get(
  '/listar/productores',
  jwtMiddlewares.verificarToken,
  personaControllers.listarProductores
)

personaRouter.get(
  '/listar/trabajadores',
  jwtMiddlewares.verificarToken,
  personaControllers.listarTrabajadores
)

personaRouter.get(
  '/listar/compradores',
  jwtMiddlewares.verificarToken,
  personaControllers.listarCompradores
)

personaRouter.get(
  '/buscar-persona',
  jwtMiddlewares.verificarToken,
  personaControllers.listarPersonaPorClave
)

personaRouter.post(
  '/agregar',
  jwtMiddlewares.verificarToken,
  validatorMiddlewares.validarDatos,
  personaControllers.registrarPersona
)

personaRouter.patch(
  '/actualizar-informacion/:id',
  jwtMiddlewares.verificarToken,
  personaControllers.actualizarPersona
)

personaRouter.delete(
  '/borrar-persona/:id',
  jwtMiddlewares.verificarToken,
  personaControllers.borrarPersona
)

export default personaRouter
