import { Producto } from "../../libs/db.js";


const actualizarProducto = async(id,data) => {
    const producto = await Producto.findOne({
        where: {
            id
        }
    })

    if(!producto) {
        return {code: 404, message: "Producto no encontrado"}
    }

    await producto.update(data)

    return {
        code: 200,
        message: "Información del producto actualizada con éxito"
    }
}


export {
    actualizarProducto
}