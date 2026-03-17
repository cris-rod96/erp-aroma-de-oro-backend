import { Router } from 'express'
import { reporteControllers } from '../../controllers/index.controllers.js'
import { jwtMiddlewares } from '../../middlewares/index.middlewares.js'

const reporteRouter = Router()

reporteRouter.get('/listar/todos', jwtMiddlewares.verificarToken, reporteControllers.listarTodos)

export default reporteRouter
