import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/User.js";
import {
  connectToDatabase,
  disconnectFromDatabase,
} from "../src/db/connection.js";

describe("User Authentication", () => {
  beforeAll(async () => {
    await connectToDatabase();
  });

  afterAll(async () => {
    await disconnectFromDatabase();
  });

  beforeEach(async () => {
    // Clean up test user
    await User.deleteMany({ email: "test@example.com" });
  });

  describe("POST /api/v1/user/signup", () => {
    it("should create a new user with valid data", async () => {
      const userData = {
        first_name: "John",
        last_name: "Doe",
        email: "test@example.com",
        password: "Test@1234",
      };

      const response = await request(app)
        .post("/api/v1/user/signup")
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body.user).toHaveProperty("email", userData.email);
    });

    it("should reject signup with weak password", async () => {
      const userData = {
        first_name: "John",
        last_name: "Doe",
        email: "test@example.com",
        password: "weak",
      };

      const response = await request(app)
        .post("/api/v1/user/signup")
        .send(userData);

      expect(response.status).toBe(400);
    });

    it("should reject duplicate email", async () => {
      const userData = {
        first_name: "John",
        last_name: "Doe",
        email: "test@example.com",
        password: "Test@1234",
      };

      await request(app).post("/api/v1/user/signup").send(userData);
      const response = await request(app)
        .post("/api/v1/user/signup")
        .send(userData);

      expect(response.status).toBe(409);
    });
  });

  describe("POST /api/v1/user/login", () => {
    beforeEach(async () => {
      // Create a test user
      await request(app).post("/api/v1/user/signup").send({
        first_name: "John",
        last_name: "Doe",
        email: "test@example.com",
        password: "Test@1234",
      });
    });

    it("should login with correct credentials", async () => {
      const response = await request(app).post("/api/v1/user/login").send({
        email: "test@example.com",
        password: "Test@1234",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.headers["set-cookie"]).toBeDefined();
    });

    it("should reject login with incorrect password", async () => {
      const response = await request(app).post("/api/v1/user/login").send({
        email: "test@example.com",
        password: "WrongPassword@123",
      });

      expect(response.status).toBe(401);
    });

    it("should reject login with non-existent email", async () => {
      const response = await request(app).post("/api/v1/user/login").send({
        email: "nonexistent@example.com",
        password: "Test@1234",
      });

      expect(response.status).toBe(401);
    });
  });
});
