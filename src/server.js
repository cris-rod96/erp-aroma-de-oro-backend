import express, { json } from 'express'
import cors from 'cors' // Usaremos el paquete oficial
import logger from 'morgan'
import rootRouter from './routes/index.routes.js'
import cookieParser from 'cookie-parser'

const server = express()

// --- 🌐 Configuración de CORS Profesional ---
const allowedOrigins = [
  'https://erp-aroma-de-oro-client.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]

server.use(
  cors({
    origin: function (origin, callback) {
      // Permitir peticiones sin origen (como Postman o apps móviles)
      // o si está en la whitelist
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('No permitido por CORS'))
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-token',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    exposedHeaders: ['x-token'], // Para que el frontend pueda leerlo si lo envías en la respuesta
  })
)

// --- Middlewares ---
server.use(json({ limit: '5mb' }))
server.use(cookieParser())
server.use(logger('dev'))

// --- Rutas ---
server.use('/api/aroma-de-oro/', rootRouter)

export default server
