import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { cloudinary, DATABASE_CONFIG, DB_COMMAND } from '../../config/config.js'
import { Respaldo } from '../../libs/db.js'
// Asegúrate de que la ruta a tu modelo sea la correcta

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Genera un backup de la base de datos de Aroma de Oro.
 * Lo comprime en .gz, lo sube a Cloudinary y guarda el registro en la DB.
 * @param {number|string} cajaId - ID de la caja asociada al cierre.
 */
const generarBackup = async (cajaId = null) => {
  const DB_URI = DATABASE_CONFIG.URI

  // 1. GENERAR NOMBRE LEGIBLE (Ejemplo: respaldo_aroma_03-04-2026_15-30.sql.gz)
  const ahora = new Date()
  const fecha = ahora.toLocaleDateString('es-EC').replace(/\//g, '-')
  const hora = ahora.toLocaleTimeString('es-EC', { hour12: false }).replace(/:/g, '-').slice(0, 5)

  const fileName = `respaldo_aroma_${fecha}_${hora}.sql.gz`
  const filePath = path.join(__dirname, fileName)

  console.log(`--- 🚀 Iniciando Respaldo: ${fileName} ---`)

  try {
    // 2. GENERAR SQL Y COMPRIMIR (Pipe pg_dump -> gzip)
    await new Promise((resolve, reject) => {
      // El comando usa el PATH de pg_dump que definiste en tu config
      exec(`${DB_COMMAND} "${DB_URI}" | gzip > "${filePath}"`, (error) => {
        if (error) return reject(error)
        resolve()
      })
    })

    // Calcular tamaño para el registro informativo
    const stats = fs.statSync(filePath)
    const tamanoMB = (stats.size / (1024 * 1024)).toFixed(2)
    console.log(`✅ Archivo local creado (${tamanoMB} MB).`)

    // 3. SUBIR A CLOUDINARY
    console.log('--- ☁️ Subiendo a la nube... ---')
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'raw',
      folder: 'aroma-de-oro/respaldos_diarios',
      public_id: fileName,
    })

    // 4. REGISTRAR EN LA BASE DE DATOS
    // Esto asume que tu tabla 'Backups' tiene estos campos
    const registro = await Backup.create({
      nombreArchivo: fileName,
      urlCloudinary: result.secure_url,
      tamano: `${tamanoMB} MB`,
      CajaId: cajaId,
      estado: 'Exitoso',
      fechaGeneracion: ahora,
    })

    // 5. LIMPIEZA: Borrar archivo del servidor (importante en Render/Heroku)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      console.log('🗑️ Temporal local eliminado exitosamente.')
    }

    console.log('--- ✅ PROCESO DE BACKUP COMPLETADO ---')
    return registro
  } catch (error) {
    console.error('❌ ERROR CRÍTICO EN EL BACKUP:', error.message)

    // Intentar registrar el error en la tabla para historial de fallos
    try {
      await Respaldo.create({
        nombreArchivo: fileName || `error_${Date.now()}`,
        urlCloudinary: 'FALLIDO',
        estado: 'Fallido',
        CajaId: cajaId,
        fechaGeneracion: ahora,
      })
    } catch (dbErr) {
      console.error('No se pudo registrar el error en la DB:', dbErr.message)
    }

    // Borrar temporal si quedó a medias
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

    throw error
  }
}

export default { generarBackup }
