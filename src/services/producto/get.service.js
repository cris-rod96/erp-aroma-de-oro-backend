import { Producto } from '../../libs/db.js'

const listarProductos = async () => {
  const productos = await Producto.findAll({
    order: [['fechaCreacion', 'DESC']],
  })

  return {
    code: 200,
    productos,
  }
}

export { listarProductos }
