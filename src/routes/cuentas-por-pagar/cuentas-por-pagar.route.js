import { Router } from 'express'
import { cuentasPorPagarControllers } from '../../controllers/index.controllers.js'

const cuentasPorPagarRouter = Router()

cuentasPorPagarRouter.get('/todas', cuentasPorPagarControllers.listarTodas)
cuentasPorPagarRouter.get('/informacion/:id', cuentasPorPagarControllers.obtenerInformacion)

export default cuentasPorPagarRouter
