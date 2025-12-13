import { Router } from "express";
import {
  healthCheck,
  detailedHealthCheck,
  readinessCheck,
  livenessCheck,
} from "../controllers/healthController.js";

const healthRouter = Router();

healthRouter.get("/", healthCheck);
healthRouter.get("/detailed", detailedHealthCheck);
healthRouter.get("/ready", readinessCheck);
healthRouter.get("/live", livenessCheck);

export default healthRouter;
