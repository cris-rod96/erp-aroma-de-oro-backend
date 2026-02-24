import { Empresa } from "../../libs/db.js";


const crearEmpresa = async(data) => {
    const empresa = await Empresa.create(data)
    return {code: 201,empresa}   
}


export {
    crearEmpresa
}