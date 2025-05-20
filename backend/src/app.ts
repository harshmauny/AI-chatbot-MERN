import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
config({ path: ".env" });

const COOKIE_SECRET = process.env.COOKIE_SECRET;
const app = express();

const corsOptions = {
  origin: ["http://localhost:8080"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser(COOKIE_SECRET));
app.use(morgan("dev"));
app.use("/api/v1", appRouter);

export default app;
