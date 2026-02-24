import { DATABASE_CONFIG } from "../config/config.js";
import { Sequelize } from "sequelize";


const sq = new Sequelize(DATABASE_CONFIG.URI,DATABASE_CONFIG.OPTIONS)


export {
    sq
}