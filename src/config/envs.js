process.loadEnvFile()


export const {
     PORT =3000,
     DATABASE_DEV_URI,
     DATABASE_PROD_URI,
     NODE_ENV = "development"
} = process.env