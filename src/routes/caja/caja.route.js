import { Router } from 'express'
import { cajaControllers } from '../../controllers/index.controllers.js'
import { jwtMiddlewares } from '../../middlewares/index.middlewares.js'

const cajaRouter = Router()

cajaRouter.post('/abrir-caja', jwtMiddlewares.verificarToken, cajaControllers.abrirCaja)
cajaRouter.patch('/cerrar-caja/:id', jwtMiddlewares.verificarToken, cajaControllers.cerrarCaja)

cajaRouter.get('/listar/todas', jwtMiddlewares.verificarToken, cajaControllers.listarTodas)
cajaRouter.get('/listar/abiertas', cajaControllers.listarAbiertas)
cajaRouter.get('/listar/cerradas', cajaControllers.listarCerradas)
cajaRouter.get('/listar/rango', cajaControllers.listarPorRango)

export default cajaRouter
