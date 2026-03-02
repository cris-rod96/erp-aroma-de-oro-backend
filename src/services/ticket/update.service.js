import { Ticket } from "../../libs/db.js";

const actualizarInformacion = async (data, id) => {
  const ticket = await Ticket.findOne({
    where: {
      id,
    },
  });

  if (!ticket)
    return {
      code: 404,
      message: "Error al actualizar el ticket. Ticket no encontrado.",
    };

  await ticket.update(data);
  return { code: 200, message: "Información del ticket actualizada" };
};

export { actualizarInformacion };
