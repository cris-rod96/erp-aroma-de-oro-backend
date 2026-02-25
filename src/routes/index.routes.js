import { Router } from "express";
import empresaRouter from "./empresa/empresa.route.js";
import usuarioRouter from "./usuario/usuario.route.js";
import productoRouter from "./producto/producto.route.js";
import nominaRouter from "./nomina/nomina.route.js";
import personaRouter from "./persona/persona.route.js";
import authRouter from "./auth/auth.route.js";

const rootRouter = Router();

rootRouter.use("/empresa", empresaRouter);
rootRouter.use("/usuarios", usuarioRouter);
rootRouter.use("/productos", productoRouter);
rootRouter.use("/nominas", nominaRouter);
rootRouter.use("/personas", personaRouter);
rootRouter.use("/auth", authRouter);

export default rootRouter;
