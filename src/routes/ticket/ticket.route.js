import { Router } from "express";
import { ticketControllers } from "../../controllers/index.controllers.js";

const ticketRouter = Router();

ticketRouter.get("/listar/todos", ticketControllers.listarTodos);

ticketRouter.get("/listar/listar-por-clave", ticketControllers.listarPorClave);

ticketRouter.get(
  "/listar/informacion/:id",
  ticketControllers.listarInformacion,
);

ticketRouter.post("/crear-ticket", ticketControllers.crearTicket);

ticketRouter.patch(
  "/actualizar-informacion/:id",
  ticketControllers.actualizarInformacion,
);

export default ticketRouter;
