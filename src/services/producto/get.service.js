import { Producto } from "../../libs/db.js";


const listarProductos = async() => {
    const productos = await Producto.findAll({})

    return {
        code: 200,
        productos
    }
}

export {
    listarProductos
}
