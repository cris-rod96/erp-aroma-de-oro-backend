import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import nodemailer from 'nodemailer'
import { NODEMAILER_CONFIG } from '../../config/config.js'

const send = async (to, file, subject) => {
  try {
    const transporter = nodemailer.createTransport(NODEMAILER_CONFIG)
    // IMPORTANTE: Ponemos el 'await' para que si falla, entre al catch
    await transporter.sendMail({
      from: `"Aroma de Oro" <${NODEMAILER_CONFIG.auth.user}>`,
      to,
      subject,
      html: file,
    })
    console.log('✅ Correo enviado a:', to)
  } catch (error) {
    // ESTO evita que el servidor de Render se apague
    console.error('❌ Error enviando correo:', error.message)
  }
}

const recuperarContraseña = async (to, user, nuevaClave, nombreEmpresa) => {
  try {
    const pathname = generarPathName('recuperar_contraseña')
    let file = fs.readFileSync(pathname, { encoding: 'utf-8' }).toString()

    // Usamos replaceAll o varios replace para asegurar que se cambie todo
    file = file
      .replace('{{NOMBRE_USUARIO}}', user)
      .replace('{{NUEVA_CLAVE}}', nuevaClave)
      .replace('{{NOMBRE_EMPRESA}}', nombreEmpresa)

    await send(to, file, 'Recuperación de contraseña')
  } catch (error) {
    console.error('❌ Error en el helper de recuperación:', error.message)
  }
}

export default {
  recuperarContraseña,
}
