import { Liquidacion, Persona, Ticket, Usuario } from "../../libs/db.js";

const registrarLiquidacion = async (data) => {
  const { TicketId, UsuarioId, ProductorId } = data;

  const usuario = await Usuario.findOne({
    where: {
      id: UsuarioId,
    },
  });

  if (!usuario)
    return {
      code: 400,
      message: "Error al crear liquidación. El usuario no existe.",
    };

  const productor = await Persona.findOne({
    where: {
      id: ProductorId,
      tipo: "Productor",
    },
  });

  if (!productor)
    return {
      code: 400,
      message: "Error al crear liquidación. El productor no existe.",
    };

  const ticket = await Ticket.findOne({
    where: {
      id: TicketId,
    },
  });

  if (!ticket)
    return {
      code: 400,
      message: "Error al crear liquidación. El ticket no existe.",
    };

  if (ticket.estadoTicket === "Liquidado")
    return { code: 400, message: "El ticket ya fue liquidado" };

  const liquidacion = await Liquidacion.create(data);

  return {
    code: 201,
    message: "Liquidación creada con éxito.",
    liquidacion,
  };
};

export { registrarLiquidacion };
