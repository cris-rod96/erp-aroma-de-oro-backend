import { Router } from 'express'
import { reporteControllers } from '../../controllers/index.controllers.js'
import { jwtMiddlewares } from '../../middlewares/index.middlewares.js'
import multer from 'multer'

const reporteRouter = Router()

const upload = multer({ storage: multer.memoryStorage() })

reporteRouter.get('/listar/todos', jwtMiddlewares.verificarToken, reporteControllers.listarTodos)

reporteRouter.post(
  '/subir-reporte',
  jwtMiddlewares.verificarToken,
  upload.single('archivoReporte'),
  reporteControllers.subirReporte
)

export default reporteRouter
