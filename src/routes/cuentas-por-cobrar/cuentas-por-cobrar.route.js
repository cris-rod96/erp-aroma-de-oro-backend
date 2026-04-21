import { Router } from 'express'
import { cuentasPorCobrarControllers } from '../../controllers/index.controllers.js'
import { jwtMiddlewares } from '../../middlewares/index.middlewares.js'

const cuentasPorCobrarRouter = Router()

cuentasPorCobrarRouter.get(
  '/todas',
  jwtMiddlewares.verificarToken,
  jwtMiddlewares.rolesAdmitidos('Administrador', 'Contador'),
  cuentasPorCobrarControllers.listarTodas
)
cuentasPorCobrarRouter.get(
  '/listar/pendientes',
  jwtMiddlewares.verificarToken,
  jwtMiddlewares.rolesAdmitidos('Administrador', 'Contador'),
  cuentasPorCobrarControllers.listarPendientes
)
cuentasPorCobrarRouter.get(
  '/listar/cobradas',
  jwtMiddlewares.verificarToken,
  jwtMiddlewares.rolesAdmitidos('Administrador', 'Contador'),
  cuentasPorCobrarControllers.listarCobradas
)

cuentasPorCobrarRouter.get(
  '/informacion/:id',
  jwtMiddlewares.verificarToken,
  jwtMiddlewares.rolesAdmitidos('Administrador', 'Contador'),
  cuentasPorCobrarControllers.obtenerInformacion
)

cuentasPorCobrarRouter.patch(
  '/registrar-cobro',
  jwtMiddlewares.verificarToken,
  jwtMiddlewares.rolesAdmitidos('Administrador', 'Contador'),
  cuentasPorCobrarControllers.registrarCobro
)

cuentasPorCobrarRouter.post(
  '/prestamo-tercero',
  jwtMiddlewares.verificarToken,
  jwtMiddlewares.rolesAdmitidos('Administrador', 'Contador'),
  cuentasPorCobrarControllers.crearPrestamoTercero
)

export default cuentasPorCobrarRouter
