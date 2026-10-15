import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes/index.js";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errors.js";

const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use("/api", router);
app.use(notFound);
app.use(errorHandler);

export default app;
