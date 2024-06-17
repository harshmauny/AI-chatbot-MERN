import { Router } from "express";
import { verifyToken } from "../utils/token.manager.js";
import { chatCompletionValidator, validate } from "../utils/validator.js";
import {
  deleteChats,
  generateChatCompletion,
  sendChatsToUser,
} from "../controllers/chatController.js";

const chatRouter = Router();

chatRouter.post(
  "/new",
  validate(chatCompletionValidator),
  verifyToken,
  generateChatCompletion,
);
chatRouter.get("/all-chats", verifyToken, sendChatsToUser);
chatRouter.delete("/delete", verifyToken, deleteChats);

export default chatRouter;
