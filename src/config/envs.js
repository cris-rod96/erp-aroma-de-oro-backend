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
} = process.env
