import { PORT } from "./src/config/envs.js";
import { sq } from "./src/libs/db.js";
import server from "./src/server.js";



sq.sync({
    logging: false,
    force: false,
    alter: true
}).then(() => {
    console.log("Base de datos conectada")
    server.listen(PORT,() => {
        console.log(`Server a la escucha por el puerto: ${PORT}`)
    })
}).catch((err) => {
    console.log("Error al iniciar la base de datos: ", err.message)
})