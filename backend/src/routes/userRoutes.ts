import { Router } from "express";
import {
  getAllUsers,
  userLogin,
  userLogout,
  userSignup,
  verifyUser,
} from "../controllers/userController.js";
import {
  signupValidation,
  loginValidation,
  validate,
} from "../middleware/validation.js";
import { verifyToken } from "../utils/token.manager.js";
import { authLimiter } from "../middleware/security.js";

const userRouter = Router();

// Public routes
userRouter.post("/signup", authLimiter, signupValidation, validate, userSignup);
userRouter.post("/login", authLimiter, loginValidation, validate, userLogin);

// Protected routes
userRouter.get("/", verifyToken, getAllUsers);
userRouter.get("/auth-status", verifyToken, verifyUser);
userRouter.get("/logout", verifyToken, userLogout);

export default userRouter;
