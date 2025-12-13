import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { appConfig } from "./config/env.js";
import { setupSecurityMiddleware } from "./middleware/security.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./config/logger.js";
import appRouter from "./routes/index.js";

const app = express();

// Security middleware
setupSecurityMiddleware(app);

// CORS configuration
const corsOptions = {
  origin: appConfig.cors.origin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Set-Cookie"],
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Cookie parser
app.use(cookieParser(appConfig.cookie.secret));

// Request logging
app.use(requestLogger);

// API routes
app.use("/api/v1", appRouter);

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
