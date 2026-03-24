import { PORT } from './src/config/envs.js'
import { sq } from './src/libs/db.js'
import { loadData } from './src/scripts/seed.scripts.js'
import server from './src/server.js'

server.listen(PORT, () => {
  console.log(`Server a la escucha por el puerto: ${PORT}`)
  sq.sync({
    logging: false,
    force: true,
    alter: true,
  })
    .then(() => {
      console.log('Base de datos conectada')

      loadData()
    })
    .catch((err) => {
      console.log(err)
      console.log('Error al iniciar la base de datos: ', err.message)
    })
})
