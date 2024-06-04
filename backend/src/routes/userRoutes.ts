import {Router} from 'express';
import { getAllUsers, userSignup } from '../controllers/userController.js';

const userRouter = Router();

userRouter.get('/', getAllUsers);
userRouter.post('/signup', userSignup)

export default userRouter;