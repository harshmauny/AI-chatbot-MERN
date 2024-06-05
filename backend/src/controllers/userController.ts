import User from "../models/User.js";
import { Request, Response, NextFunction } from "express";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { createToken } from "../utils/token.manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await User.find();
    return res.status(200).json({ message: "OK", users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const userSignup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(401).json({ message: "User already exists" });
    const hashedPassword = await hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    const token = createToken(user.id, user.email);
    const expires = new Date(Date.now() + 7);
    res.cookie("auth_token", token, {
      path: "/",
      domain: "localhost",
      expires,
      httpOnly: true,
      signed: true,
    });
    return res.status(201).json({ message: "OK", id: user._id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(403).json({ message: "Invalid credentials" });
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domain: "localhost",
      signed: true,
      path: "/",
    });
    const token = createToken(user.id, user.email);
    const expires = new Date(Date.now() + 7);
    res.cookie("auth_token", token, {
      path: "/",
      domain: "localhost",
      expires,
      httpOnly: true,
      signed: true,
    });
    console.log(res.cookie);
    return res.status(200).json({ message: "OK", user: user._id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
