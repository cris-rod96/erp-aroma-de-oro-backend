import { Router } from 'express'
import { cajaControllers } from '../../controllers/index.controllers.js'
import { jwtMiddlewares } from '../../middlewares/index.middlewares.js'

const cajaRouter = Router()

cajaRouter.post('/abrir-caja', jwtMiddlewares.verificarToken, cajaControllers.abrirCaja)
cajaRouter.patch('/cerrar-caja/:id', jwtMiddlewares.verificarToken, cajaControllers.cerrarCaja)

cajaRouter.get('/listar/todas', jwtMiddlewares.verificarToken, cajaControllers.listarTodas)
cajaRouter.get('/obtener-abierta', cajaControllers.obtenerCajaAbierta)
cajaRouter.get('/listar/cerradas', cajaControllers.listarCerradas)
cajaRouter.get('/listar/rango', cajaControllers.listarPorRango)

cajaRouter.post(
  '/inyectar-banco',
  jwtMiddlewares.verificarToken,
  cajaControllers.postInyeccionBanco
)

export default cajaRouter
