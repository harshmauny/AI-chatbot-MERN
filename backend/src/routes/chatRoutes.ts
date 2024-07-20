import { Router } from "express";
import { verifyToken } from "../utils/token.manager.js";
import { chatCompletionValidator, validate } from "../utils/validator.js";
import {
  deleteChats,
  generateChatCompletion,
  getAllChats,
  sendChatsToUser,
  getChatById,
  createNewChat,
} from "../controllers/chatController.js";

const chatRouter = Router();

chatRouter.post(
  "/chat-completion",
  validate(chatCompletionValidator),
  verifyToken,
  generateChatCompletion,
);
chatRouter.post("/new-chat", verifyToken, createNewChat);
chatRouter.get("/all-chats", verifyToken, getAllChats);
chatRouter.get("/chat", verifyToken, getChatById);
chatRouter.delete("/delete/:id", verifyToken, deleteChats);

export default chatRouter;
