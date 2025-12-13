import { Request, Response } from "express";
import mongoose from "mongoose";
import { asyncHandler } from "../middleware/errorHandler.js";

// Basic health check
export const healthCheck = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Detailed health check with dependencies
export const detailedHealthCheck = asyncHandler(
  async (req: Request, res: Response) => {
    const health = {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      status: "healthy",
      services: {
        database: "unknown",
        memory: {
          used: process.memoryUsage().heapUsed / 1024 / 1024, // MB
          total: process.memoryUsage().heapTotal / 1024 / 1024, // MB
        },
      },
    };

    // Check database connection
    try {
      const dbState = mongoose.connection.readyState;
      health.services.database = dbState === 1 ? "connected" : "disconnected";
    } catch (error) {
      health.services.database = "error";
      health.status = "unhealthy";
    }

    const statusCode = health.status === "healthy" ? 200 : 503;
    res.status(statusCode).json(health);
  },
);

// Readiness probe (for Kubernetes/Docker)
export const readinessCheck = asyncHandler(
  async (req: Request, res: Response) => {
    const isReady = mongoose.connection.readyState === 1;

    if (isReady) {
      res.status(200).json({ status: "ready" });
    } else {
      res.status(503).json({ status: "not ready" });
    }
  },
);

// Liveness probe
export const livenessCheck = asyncHandler(
  async (req: Request, res: Response) => {
    res.status(200).json({ status: "alive" });
  },
);
