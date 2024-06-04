import {Router} from 'express';
import userRouter from './userRoutes.js';
import chatRouter from './chatRoutes.js';

const appRouter = Router();

appRouter.use('/user', userRouter);
appRouter.use('/chats', chatRouter)

export default appRouter;