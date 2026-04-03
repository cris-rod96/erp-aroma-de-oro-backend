import { Persona, Producto, Usuario, Venta } from '../../libs/db.js'

const listarVentas = async () => {
  const ventas = await Venta.findAll({
    include: [Persona, Producto, Usuario],
    order: [['createdAt', 'DESC']],
  })

  return { code: 200, ventas }
}

export { listarVentas }
