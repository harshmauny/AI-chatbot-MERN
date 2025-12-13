import request from "supertest";
import app from "../src/app.js";
import {
  connectToDatabase,
  disconnectFromDatabase,
} from "../src/db/connection.js";

describe("Health Check Endpoints", () => {
  beforeAll(async () => {
    await connectToDatabase();
  });

  afterAll(async () => {
    await disconnectFromDatabase();
  });

  describe("GET /api/v1/health", () => {
    it("should return 200 and health status", async () => {
      const response = await request(app).get("/api/v1/health");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty("timestamp");
    });
  });

  describe("GET /api/v1/health/detailed", () => {
    it("should return detailed health information", async () => {
      const response = await request(app).get("/api/v1/health/detailed");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("uptime");
      expect(response.body).toHaveProperty("services");
      expect(response.body.services).toHaveProperty("database");
      expect(response.body.services).toHaveProperty("memory");
    });
  });

  describe("GET /api/v1/health/ready", () => {
    it("should return readiness status", async () => {
      const response = await request(app).get("/api/v1/health/ready");

      expect([200, 503]).toContain(response.status);
      expect(response.body).toHaveProperty("status");
    });
  });
});
