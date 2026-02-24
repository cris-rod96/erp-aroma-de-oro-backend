import express, {json} from "express"
import cors from "cors"
import logger from "morgan"

const server = express()


server.use(cors())
server.use(json({limit: "5mb"}))
server.use(logger("dev"))

export default server