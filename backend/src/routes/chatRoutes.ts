import { Router } from "express";
import { verifyToken } from "../utils/token.manager.js";
import { chatMessageValidation, validate } from "../middleware/validation.js";
import {
  deleteChats,
  generateChatCompletion,
  getAllChats,
  sendChatsToUser,
  getChatById,
  createNewChat,
} from "../controllers/chatController.js";
import { chatLimiter } from "../middleware/security.js";

const chatRouter = Router();

// All chat routes require authentication
chatRouter.use(verifyToken);

// Chat operations
chatRouter.post(
  "/chat-completion",
  chatLimiter,
  chatMessageValidation,
  validate,
  generateChatCompletion,
);
chatRouter.post("/new-chat", createNewChat);
chatRouter.get("/all-chats", getAllChats);
chatRouter.get("/chat/:id", getChatById);
chatRouter.delete("/delete/:id", deleteChats);

export default chatRouter;
