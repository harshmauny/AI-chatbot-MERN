import User from "../models/User.js";
import { Request, Response, NextFunction } from "express";
import { hash, compare } from "bcryptjs";
import { createToken } from "../utils/token.manager.js";
import { COOKIE_NAME } from "../utils/constants.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import {
  NotFoundError,
  AuthenticationError,
  AuthorizationError,
  ConflictError,
} from "../utils/errors.js";
import logger from "../config/logger.js";
import { appConfig } from "../config/env.js";

export const getAllUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find().select("-password");
    return res.status(200).json({
      status: "success",
      count: users.length,
      users,
    });
  },
);

export const userSignup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { first_name, last_name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError("User already exists with this email");
    }

    const hashedPassword = await hash(password, 12);
    const user = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      chats: [{ conversation: [], chatName: "New Chat" }],
    });

    await user.save();

    const token = createToken(user.id, user.email, appConfig.jwt.expiresIn);
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    const cookieOptions = {
      path: "/",
      domain: appConfig.env === "production" ? undefined : "localhost",
      expires,
      httpOnly: true,
      signed: true,
      secure: appConfig.env === "production",
      sameSite:
        appConfig.env === "production" ? ("strict" as const) : ("lax" as const),
    };

    res.cookie("auth_token", token, cookieOptions);

    logger.info(`New user signed up: ${user.email}`);

    return res.status(201).json({
      status: "success",
      message: "User created successfully",
      user: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
    });
  },
);

export const userLogin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new AuthenticationError("Invalid credentials");
    }

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new AuthenticationError("Invalid credentials");
    }

    // Clear old cookie
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domain: appConfig.env === "production" ? undefined : "localhost",
      signed: true,
      path: "/",
    });

    const token = createToken(user.id, user.email, appConfig.jwt.expiresIn);
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    const cookieOptions = {
      path: "/",
      domain: appConfig.env === "production" ? undefined : "localhost",
      expires,
      httpOnly: true,
      signed: true,
      secure: appConfig.env === "production",
      sameSite:
        appConfig.env === "production" ? ("strict" as const) : ("lax" as const),
    };

    res.cookie("auth_token", token, cookieOptions);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    logger.info(`User logged in: ${user.email}`);

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      user: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
    });
  },
);

export const verifyUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(res.locals.jwtData.id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user._id.toString() !== res.locals.jwtData.id) {
      throw new AuthorizationError("Unauthorized");
    }

    return res.status(200).json({
      status: "success",
      user: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
    });
  },
);

export const userLogout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(res.locals.jwtData.id);

    if (!user) {
      throw new NotFoundError("User not registered or token malfunctioned");
    }

    if (user._id.toString() !== res.locals.jwtData.id) {
      throw new AuthorizationError("Permissions didn't match");
    }

    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domain: appConfig.env === "production" ? undefined : "localhost",
      signed: true,
      path: "/",
    });

    logger.info(`User logged out: ${user.email}`);

    return res.status(200).json({
      status: "success",
      message: "Logout successful",
    });
  },
);
