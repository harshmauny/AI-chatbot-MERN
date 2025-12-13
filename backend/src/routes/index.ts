import { Router } from "express";
import userRouter from "./userRoutes.js";
import chatRouter from "./chatRoutes.js";
import healthRouter from "./healthRoutes.js";

const appRouter = Router();

// Health check routes (no auth required)
appRouter.use("/health", healthRouter);

// User routes
appRouter.use("/user", userRouter);

// Chat routes
appRouter.use("/chat", chatRouter);

export default appRouter;
