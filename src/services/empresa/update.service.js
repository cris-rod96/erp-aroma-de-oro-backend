import { Empresa } from "../../libs/db.js";


const actualizarInformacion = async(id,data) => {
    const empresa = await Empresa.findByPk(id)

    if(empresa){
        await Empresa.update(data)
        return {code: 200, message: "Información actualizada"}
    }else{
        return {code: 404, message: "Error al actualizar"}
    }
}

export {
    actualizarInformacion
}
