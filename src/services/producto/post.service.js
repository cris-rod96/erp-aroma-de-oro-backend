import { Producto } from "../../libs/db.js";


const crearProducto = async(data) => {
    const producto = await Producto.create(data)

    return producto ? {
        code: 201,
        message: "Producto creado con éxito"
    } : {
        code: 400,
        message: "Error al crear el producto. Intente de nuevo"
    }
}

export {
    crearProducto
}