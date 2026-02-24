import { DATABASE_CONFIG } from "../config/config.js";
import { Sequelize } from "sequelize";
import { models } from "../models/index.models.js";


const sq = new Sequelize(DATABASE_CONFIG.URI,DATABASE_CONFIG.OPTIONS)


models.forEach((model) => model(sq))

const {Empresa,Persona,Usuario,Producto,Nomina} = sq.models


Persona.hasMany(Nomina, {foreignKey: "PersonaId"})
Nomina.belongsTo(Persona,{foreignKey: "PersonaId"})


export {
    sq,
    Empresa,
    Persona,
    Usuario,
    Producto,
    Nomina
}