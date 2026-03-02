import { Producto, Ticket } from "../../libs/db.js";

const crearTicket = async (data) => {
  const tickets = await Ticket.findAll();
  const cantidadTicketsStr = String(tickets.length + 1);
  const numeroTicket = cantidadTicketsStr.padStart(7, 0);

  const { ProductoId } = data;

  const producto = await Producto.findOne({
    where: {
      id: ProductoId,
    },
  });

  if (!producto)
    return {
      code: 400,
      message: "Error al crear el ticket. Producto no encontrado",
    };

  const nuevoTicket = await Ticket.create({
    ...data,
    numero: numeroTicket,
  });

  return {
    code: 201,
    message: "Ticket creado con éxito",
    ticket: nuevoTicket.dataValues,
  };
};
export { crearTicket };
