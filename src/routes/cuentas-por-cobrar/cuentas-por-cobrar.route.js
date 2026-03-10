import { Router } from 'express'
import { cuentasPorCobrarControllers } from '../../controllers/index.controllers.js'

const cuentasPorCobrarRouter = Router()

cuentasPorCobrarRouter.get('/todas', cuentasPorCobrarControllers.listarTodas)
cuentasPorCobrarRouter.get('/informacion/:id', cuentasPorCobrarControllers.obtenerInformacion)

export default cuentasPorCobrarRouter
