import { cloudinaryHelper } from '../../helpers/index.helpers.js'
import { Reporte } from '../../libs/db.js'

const subirReporte = async (data, fileBuffer) => {
  const { url, publicId } = await cloudinaryHelper.subirCloudinary(fileBuffer, 'reportes')

  const nuevoReporte = await Reporte.create({
    ...data,
    url,
    publicId,
  })

  return { code: 200, nuevoReporte }
}

export { subirReporte }
