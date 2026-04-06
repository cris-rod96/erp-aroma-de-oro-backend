import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

export const {
  PORT = 3000,
  DATABASE_DEV_URI,
  DATABASE_PROD_URI,
  NODE_ENV = 'development',
  SECRET_WORD,
  PASSWORD_DEFAULT,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_API_CLOUD_NAME,
  EMAIL_SECURE_PASSWORD,
  EMAIL_SECURE_DIR,
  RESEND_API_KEY,
  BACKUP_PASSWORD,
} = process.env
