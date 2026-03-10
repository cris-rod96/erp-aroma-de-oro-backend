import { Router } from 'express'
import { empresaControllers } from '../../controllers/index.controllers.js'
import { jwtMiddlewares, validatorMiddlewares } from '../../middlewares/index.middlewares.js'
empresaControllers

const empresaRouter = Router()

empresaRouter.get('/info', jwtMiddlewares.verificarToken, empresaControllers.listarInformacion)
empresaRouter.post(
  '/create',
  jwtMiddlewares.verificarToken,
  validatorMiddlewares.validarDatos,
  empresaControllers.crearEmpresa
)
empresaRouter.patch(
  '/update/:id',
  jwtMiddlewares.verificarToken,
  empresaControllers.actualizarInformacion
)

export default empresaRouter
