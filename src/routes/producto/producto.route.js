import { Router } from 'express'
import { productoControllers } from '../../controllers/index.controllers.js'
import { jwtMiddlewares, validatorMiddlewares } from '../../middlewares/index.middlewares.js'
import { validatorProducto } from '../../validations/index.validations.js'

const productoRouter = Router()

productoRouter.get('/todos', productoControllers.listarProductos)
productoRouter.post(
  '/agregar',
  jwtMiddlewares.verificarToken,
  validatorMiddlewares.validarDatos,
  validatorProducto.validacionCrearProducto,
  productoControllers.crearProducto
)
productoRouter.patch('/actualizar-informacion/:id', productoControllers.actualizarProducto)

export default productoRouter
