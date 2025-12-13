import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";
import logger from "./config/logger.js";
import { appConfig } from "./config/env.js";
const PORT = appConfig.port;
const startServer = async () => {
    try {
        // Connect to database
        await connectToDatabase();
        // Start server
        const server = app.listen(PORT, () => {
            logger.info(`🚀 Server is running on http://localhost:${PORT}`);
            logger.info(`📝 Environment: ${appConfig.env}`);
            logger.info(`📚 API Documentation: http://localhost:${PORT}/api/v1/health`);
        });
        // Graceful shutdown
        const gracefulShutdown = async (signal) => {
            logger.info(`${signal} received. Starting graceful shutdown...`);
            server.close(async () => {
                logger.info("HTTP server closed");
                process.exit(0);
            });
            // Force close after 10 seconds
            setTimeout(() => {
                logger.error("Forced shutdown after timeout");
                process.exit(1);
            }, 10000);
        };
        process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
        process.on("SIGINT", () => gracefulShutdown("SIGINT"));
        // Handle unhandled promise rejections
        process.on("unhandledRejection", (reason, promise) => {
            logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
            gracefulShutdown("unhandledRejection");
        });
        // Handle uncaught exceptions
        process.on("uncaughtException", (error) => {
            logger.error(`Uncaught Exception: ${error.message}`);
            gracefulShutdown("uncaughtException");
        });
    }
    catch (error) {
        logger.error(`Failed to start server: ${error}`);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map