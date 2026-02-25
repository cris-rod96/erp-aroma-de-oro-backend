import express, { json } from "express";
import cors from "cors";
import logger from "morgan";
import rootRouter from "./routes/index.routes.js";

const server = express();

server.use(cors());
server.use(json({ limit: "5mb" }));
server.use(logger("dev"));

server.use("/api/aroma-de-oro/", rootRouter);

export default server;
