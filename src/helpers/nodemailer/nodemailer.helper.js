import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import nodemailer from 'nodemailer'
import { NODEMAILER_CONFIG } from '../../config/config.js'

// Definimos la base una sola vez
const __dirname = dirname(fileURLToPath(import.meta.url))

const recuperarContraseña = async (to, user, nuevaClave, nombreEmpresa) => {
  try {
    // 1. Construir la ruta al HTML (Subimos 2 niveles desde helpers para llegar a la raíz)
    const pathname = path.join(__dirname, '../../html/recuperar_contraseña.html')

    // 2. Leer el archivo (Si falla aquí, el try/catch lo atrapa y el server NO muere)
    let content = fs.readFileSync(pathname, 'utf-8')

    // 3. Reemplazar variables
    const htmlFinal = content
      .replace('{{NOMBRE_USUARIO}}', user)
      .replace('{{NUEVA_CLAVE}}', nuevaClave)
      .replace('{{NOMBRE_EMPRESA}}', nombreEmpresa)

    // 4. Configurar transporte y enviar (AWAIT es clave para atrapar el error de red)
    const transporter = nodemailer.createTransport(NODEMAILER_CONFIG)

    await transporter.sendMail({
      from: `"Aroma de Oro" <${NODEMAILER_CONFIG.auth.user}>`,
      to,
      subject: 'Recuperación de contraseña',
      html: htmlFinal,
    })

    console.log(`✅ Correo enviado con éxito a ${to}`)
  } catch (error) {
    // ESTO evita el "triggerUncaughtException" que tumba tu server en Render
    console.error('❌ ERROR EN EL PROCESO DE CORREO:', error.message)
  }
}

export default {
  recuperarContraseña,
}
