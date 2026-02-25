import { Router } from "express";
import { empresaControllers } from "../../controllers/index.controllers.js";
empresaControllers;

const empresaRouter = Router();

empresaRouter.get("/info", empresaControllers.listarInformacion);
empresaRouter.post("/create", empresaControllers.crearEmpresa);
empresaRouter.put("/update/:id", empresaControllers.actualizarInformacion);

export default empresaRouter;
