import mongoose from "mongoose";
import logger from "../config/logger.js";
import { appConfig } from "../config/env.js";

const connectionOptions = {
  maxPoolSize: 10,
  minPoolSize: 5,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
  family: 4, // Use IPv4, skip trying IPv6
};

async function connectToDatabase() {
  try {
    await mongoose.connect(appConfig.mongoUrl, connectionOptions);
    logger.info("✅ Database connected successfully");

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      logger.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("MongoDB reconnected");
    });
  } catch (error) {
    logger.error(`Database connection failed: ${error}`);
    throw new Error("Database connection failed");
  }
}

async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect();
    logger.info("Database disconnected gracefully");
  } catch (error) {
    logger.error(`Database disconnection failed: ${error}`);
    throw new Error("Database disconnection failed");
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  await disconnectFromDatabase();
  process.exit(0);
});

export { connectToDatabase, disconnectFromDatabase };
