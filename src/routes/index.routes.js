import { Router } from 'express'
import empresaRouter from './empresa/empresa.route.js'
import usuarioRouter from './usuario/usuario.route.js'
import productoRouter from './producto/producto.route.js'
import nominaRouter from './nomina/nomina.route.js'
import personaRouter from './persona/persona.route.js'
import authRouter from './auth/auth.route.js'
import ticketRouter from './ticket/ticket.route.js'
import cajaRouter from './caja/caja.route.js'
import movimientoRouter from './movimiento/movimiento.route.js'
import cuentasPorCobrarRouter from './cuentas-por-cobrar/cuentas-por-cobrar.route.js'
import cuentasPorPagarRouter from './cuentas-por-pagar/cuentas-por-pagar.route.js'
const rootRouter = Router()

rootRouter.use('/empresa', empresaRouter)
rootRouter.use('/usuarios', usuarioRouter)
rootRouter.use('/productos', productoRouter)
rootRouter.use('/nominas', nominaRouter)
rootRouter.use('/personas', personaRouter)
rootRouter.use('/auth', authRouter)
rootRouter.use('/tickets', ticketRouter)
rootRouter.use('/cajas', cajaRouter)
rootRouter.use('/movimientos', movimientoRouter)
rootRouter.use('/cuentas-por-cobrar', cuentasPorCobrarRouter)
rootRouter.use('/cuentas-por-pagar', cuentasPorPagarRouter)
export default rootRouter
