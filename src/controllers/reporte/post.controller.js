import { reporteService } from '../../services/index.services.js'

const subirReporte = async (req, res) => {
  try {
    const file = req.file
    const data = req.body

    if (!file) {
      return res.status(400).json({
        message: 'Falta el archivo PDF',
      })
    }

    const datosReporte = {
      nombre: data.nombre,
      tipo: data.tipo,
      fechaRangoInicio: data.fechaRangoInicio,
      fechaRangoFin: data.fechaRangoFin,
      formato: data.formato || 'PDF',
      UsuarioId: data.UsuarioId, // Obtenido del x-token
    }

    const { code, nuevoReporte } = await reporteService.subirReporte(datosReporte, file.buffer)
    res.status(code).json({
      nuevoReporte,
    })
  } catch (error) {
    console.error('Error en postUploadReporte:', error)
    res.status(500).json({ message: 'Error interno al procesar reporte' })
  }
}

export { subirReporte }
