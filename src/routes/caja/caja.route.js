import { Router } from 'express'
import { cajaControllers } from '../../controllers/index.controllers.js'
import { jwtMiddlewares } from '../../middlewares/index.middlewares.js'

const cajaRouter = Router()

cajaRouter.post(
  '/abrir-caja',
  jwtMiddlewares.verificarToken,
  jwtMiddlewares.rolesAdmitidos('Administrador', 'Contador'),
  cajaControllers.abrirCaja
)
cajaRouter.patch(
  '/cerrar-caja/:id',
  jwtMiddlewares.verificarToken,
  jwtMiddlewares.rolesAdmitidos('Administrador', 'Contador'),
  cajaControllers.cerrarCaja
)

cajaRouter.get(
  '/listar/todas',
  jwtMiddlewares.verificarToken,
  jwtMiddlewares.rolesAdmitidos('Administrador', 'Contador'),
  cajaControllers.listarTodas
)
cajaRouter.get(
  '/obtener-abierta',
  jwtMiddlewares.verificarToken,
  jwtMiddlewares.rolesAdmitidos('Administrador', 'Contador'),
  cajaControllers.obtenerCajaAbierta
)
cajaRouter.get(
  '/listar/cerradas',
  jwtMiddlewares.verificarToken,
  jwtMiddlewares.rolesAdmitidos('Administrador', 'Contador'),
  cajaControllers.listarCerradas
)
cajaRouter.get(
  '/listar/rango',
  jwtMiddlewares.verificarToken,
  jwtMiddlewares.rolesAdmitidos('Administrador', 'Contador'),
  cajaControllers.listarPorRango
)

cajaRouter.post(
  '/inyectar-banco',
  jwtMiddlewares.verificarToken,
  jwtMiddlewares.rolesAdmitidos('Administrador', 'Contador'),
  cajaControllers.postInyeccionBanco
)

cajaRouter.post(
  '/inyectar-venta',
  jwtMiddlewares.verificarToken,
  jwtMiddlewares.rolesAdmitidos('Administrador', 'Contador'),
  cajaControllers.registrarVentaRapida
)

cajaRouter.patch(
  '/reabrir-caja/:id',
  jwtMiddlewares.verificarToken,
  jwtMiddlewares.rolesAdmitidos('Administrador'),
  cajaControllers.reAperturarCaja
)

// cajaRouter.patch(
//   '/actualizar-data/:id',
//   jwtMiddlewares.verificarToken,
//   jwtMiddlewares.rolesAdmitidos('Administrador'),
//   cajaControllers.updateDataCaja
// )

export default cajaRouter
