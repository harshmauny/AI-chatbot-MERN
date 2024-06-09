import { Router } from "express";
import {
  getAllUsers,
  userLogin,
  userSignup,
  verifyUser,
} from "../controllers/userController.js";
import {
  validate,
  signupValidator,
  loginValidator,
} from "../utils/validator.js";
import { verifyToken } from "../utils/token.manager.js";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.post("/signup", validate(signupValidator), userSignup);
userRouter.post("/login", validate(loginValidator), userLogin);
userRouter.get("/auth-status", verifyToken, verifyUser);

export default userRouter;
