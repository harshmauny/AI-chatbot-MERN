import { Router } from "express";
import { verifyToken } from "../utils/token.manager.js";
import { chatCompletionValidator, validate } from "../utils/validator.js";

const chatRouter = Router();

chatRouter.post("/new", validate(chatCompletionValidator), verifyToken);

export default chatRouter;
