import { z } from "zod";
import { config } from "dotenv";

config({ path: ".env" });

// Define environment schema
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("5000"),
  MONGODB_URL: z.string().min(1, "MongoDB URL is required"),
  JWT_SECRET: z.string().min(32, "JWT secret must be at least 32 characters"),
  JWT_EXPIRE_TIME: z.string().default("7d"),
  COOKIE_SECRET: z
    .string()
    .min(32, "Cookie secret must be at least 32 characters"),
  COHERE_API_KEY: z.string().min(1, "Cohere API key is required"),
  OPENAI_API_KEY: z.string().optional(),
  CORS_ORIGIN: z.string().default("http://localhost:8080"),
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
  RATE_LIMIT_WINDOW_MS: z.string().default("900000"), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.string().default("100"),
});

// Validate environment variables
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error("❌ Invalid environment variables:");
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join(".")}: ${err.message}`);
      });
    }
    process.exit(1);
  }
};

export const env = parseEnv();

// Export typed environment configuration
export const appConfig = {
  env: env.NODE_ENV,
  port: parseInt(env.PORT, 10),
  mongoUrl: env.MONGODB_URL,
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRE_TIME,
  },
  cookie: {
    secret: env.COOKIE_SECRET,
  },
  cohere: {
    apiKey: env.COHERE_API_KEY,
  },
  openai: {
    apiKey: env.OPENAI_API_KEY,
  },
  cors: {
    origin: env.CORS_ORIGIN.split(","),
  },
  logging: {
    level: env.LOG_LEVEL,
  },
  rateLimit: {
    windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS, 10),
    maxRequests: parseInt(env.RATE_LIMIT_MAX_REQUESTS, 10),
  },
} as const;

export const isDevelopment = env.NODE_ENV === "development";
export const isProduction = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";
