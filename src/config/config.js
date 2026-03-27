import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import {
  DATABASE_PROD_URI,
  DATABASE_DEV_URI,
  NODE_ENV,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_API_CLOUD_NAME,
  EMAIL_SECURE_DIR,
  EMAIL_SECURE_PASSWORD,
} from './envs.js'

export const NODEMAILER_CONFIG = {
  host: 'smtp.gmail.com',
  port: 465, // Cambiado de 587 a 465
  secure: true, // Cambiado de false a true
  family: 4,
  auth: {
    user: EMAIL_SECURE_DIR,
    pass: EMAIL_SECURE_PASSWORD,
  },
}

const _defaultConfig = {
  logging: false,
  native: false,
  dialect: 'postgres',
}

export const DATABASE_CONFIG = {
  URI: NODE_ENV === 'development' ? DATABASE_DEV_URI : DATABASE_PROD_URI,
  OPTIONS:
    NODE_ENV === 'development'
      ? { ..._defaultConfig }
      : {
          ..._defaultConfig,
          dialectOptions: {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          },
        },
}

cloudinary.config({
  cloud_name: CLOUDINARY_API_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
})

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'aroma-de-oro/facturas',
    allowed_formats: ['pdf', 'jpf', 'png'],
    public_id: (req, file) => `doc-${Date.now()}`,
  },
})

export { cloudinary }
