import { DetalleLiquidacion, Producto } from '../../libs/db.js'

const listarProductos = async () => {
  const productos = await Producto.findAll({
    include: [{ model: DetalleLiquidacion }],
    order: [['fechaCreacion', 'DESC']],
  })

  return {
    code: 200,
    productos,
  }
}

export { listarProductos }
