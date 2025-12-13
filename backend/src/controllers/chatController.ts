import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import { CohereConfig } from "../config/cohere-config.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { NotFoundError, AuthorizationError } from "../utils/errors.js";
import logger from "../config/logger.js";

export const generateChatCompletion = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { message, id } = req.body;
    const user = await User.findById(res.locals.jwtData.id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const currentChat = user.chats.find((chat) => chat.id === id);
    if (!currentChat) {
      throw new NotFoundError("Chat not found");
    }

    const chats = currentChat.conversation.map(({ role, content }) => ({
      role,
      message: content,
    })) as any[];

    try {
      const config = CohereConfig();
      const completion = await config.chat({
        model: "command-r-plus",
        chatHistory: chats,
        message: message,
      });

      const updatedChat = completion.chatHistory.map((item: any) => ({
        role: item.role,
        content: item.message,
      }));

      user.chats.find((chat) => chat.id === id)!.conversation =
        updatedChat as any;
      await user.save();

      logger.info(`Chat completion generated for user ${user.email}`);

      return res.status(200).json({
        status: "success",
        message: "Chat completion generated",
        chats: user.chats,
      });
    } catch (error) {
      logger.error(`Cohere API error: ${error}`);
      throw error;
    }
  },
);

export const getAllChats = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(res.locals.jwtData.id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return res.status(200).json({
      status: "success",
      chats: user.chats,
    });
  },
);

export const getChatById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await User.findById(res.locals.jwtData.id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const chat = user.chats.find((chat) => chat.id === id);
    if (!chat) {
      throw new NotFoundError("Chat not found");
    }

    return res.status(200).json({
      status: "success",
      chat,
    });
  },
);

export const sendChatsToUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(res.locals.jwtData.id);

    if (!user) {
      throw new NotFoundError("User not registered or token malfunctioned");
    }

    if (user._id.toString() !== res.locals.jwtData.id) {
      throw new AuthorizationError("Permissions didn't match");
    }

    return res.status(200).json({
      status: "success",
      chats: user.chats[0]?.conversation || [],
    });
  },
);

export const deleteChats = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await User.findById(res.locals.jwtData.id);

    if (!user) {
      throw new NotFoundError("User not registered or token malfunctioned");
    }

    if (user._id.toString() !== res.locals.jwtData.id) {
      throw new AuthorizationError("Permissions didn't match");
    }

    const filteredChats = user.chats.filter((chat: any) => chat.id !== id);
    user.chats = filteredChats as any;
    await user.save();

    logger.info(`Chat ${id} deleted for user ${user.email}`);

    return res.status(200).json({
      status: "success",
      message: "Chat deleted successfully",
    });
  },
);

export const createNewChat = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(res.locals.jwtData.id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    user.chats.push({ conversation: [], chatName: "New Chat" } as any);
    await user.save();

    const newChat = user.chats[user.chats.length - 1];
    logger.info(`New chat created for user ${user.email}`);

    return res.status(201).json({
      status: "success",
      message: "Chat created successfully",
      chats: user.chats,
      chatId: newChat.id,
    });
  },
);
