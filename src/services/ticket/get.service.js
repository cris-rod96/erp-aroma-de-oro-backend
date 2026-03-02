import { Ticket } from "../../libs/db.js";

const listarTodos = async () => {
  const tickets = await Ticket.findAll();

  return {
    code: 200,
    tickets,
  };
};

const listarInformacion = async (id) => {
  const ticket = await Ticket.findOne({
    where: {
      id,
    },
  });
  if (!ticket) return { code: 404, message: "El ticket no existe." };

  return { code: 200, ticket };
};

const listarPorClave = async (clave, valor) => {
  const tickets = await Ticket.findAll({
    where: {
      [clave]: valor,
    },
  });

  return {
    code: 200,
    tickets,
  };
};

export { listarInformacion, listarPorClave, listarTodos };
