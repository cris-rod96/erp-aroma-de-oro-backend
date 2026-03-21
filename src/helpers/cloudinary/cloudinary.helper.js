import { cloudinary } from '../../config/config.js'

const subirCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `aroma-de-oro/${folder}`,
        resource_type: 'raw',
        format: 'pdf',
      },
      (error, result) => {
        if (error) return reject(error)
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        })
      }
    )
    stream.end(fileBuffer)
  })
}

export default { subirCloudinary }
