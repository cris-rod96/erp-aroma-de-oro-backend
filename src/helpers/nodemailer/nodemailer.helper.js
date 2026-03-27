import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import nodemailer from 'nodemailer'
import { NODEMAILER_CONFIG } from '../../config/config.js'

const generarPathName = (fileName) => {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const pathname = path.join(__dirname, `../../html/${fileName}.html`)
  return pathname
}

const send = (to, file, subject) => {
  const transporter = nodemailer.createTransport(NODEMAILER_CONFIG)
  transporter.sendMail({
    from: NODEMAILER_CONFIG.auth.user,
    to,
    subject,
    html: file,
  })
}

const recuperarContraseña = (to, user, nuevaClave, nombreEmpresa) => {
  const pathname = generarPathName('recuperar_contraseña')
  const file = fs
    .readFileSync(pathname, { encoding: 'utf-8' })
    .toString()
    .replace('{{NOMBRE_USUARIO}}', user)
    .replace(`{{NUEVA_CLAVE}}`, nuevaClave)
    .replace('{{NOMBRE_EMPRESA}}', nombreEmpresa)

  send(to, file, 'Recuperación de contraseña')
}

export default {
  recuperarContraseña,
}
