import { Empresa } from "../../libs/db.js";



const listarInformacion = async () => {
    const empresa = await Empresa.findOne()
    return {code: 200,empresa}
}


export {
    listarInformacion
}
