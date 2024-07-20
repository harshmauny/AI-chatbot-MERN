import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import { CohereConfig } from "../config/cohere-config.js";

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { message, id } = req.body;
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const currentChat = user.chats.find((chat) => chat.id === id);
    const chats = currentChat.conversation.map(({ role, content }) => ({
      role,
      message: content,
    })) as any[];
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

    user.chats.find((chat) => chat.id === id).conversation = updatedChat as any;
    await user.save();
    return res.status(200).json({ message: "OK", chats: user.chats });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getAllChats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "OK", chats: user.chats });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getChatById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const chat = user.chats.find((chat) => chat.id === id);
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    return res.status(200).json({ message: "OK", chat });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const sendChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    return res
      .status(200)
      .json({ message: "OK", chats: user.chats[0].conversation });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

export const deleteChats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    //user token check
    const { id } = req.params;
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    //@ts-ignore
    user.chats = user.chats.filter((chat) => chat.id !== id);
    await user.save();
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

export const createNewChat = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.chats.push({ conversation: [], chatName: "New Chat" });
    await user.save();
    return res.status(200).json({
      message: "OK",
      chats: user.chats,
      chatId: user.chats[user.chats.length - 1].id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
