import { Router } from 'express'
import { ventaControllers } from '../../controllers/index.controllers.js'
import { jwtMiddlewares } from '../../middlewares/index.middlewares.js'

const ventaRouter = Router()

ventaRouter.get('/listar/todas', jwtMiddlewares.verificarToken, ventaControllers.listarVentas)
ventaRouter.post('/registrar', jwtMiddlewares.verificarToken, ventaControllers.registrarVenta)

export default ventaRouter
