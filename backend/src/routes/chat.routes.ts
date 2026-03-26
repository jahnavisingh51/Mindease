import * as chatController from '../controllers/chatController.ts';
import { authMiddleware } from '../middlewares/authMiddleware.ts';
import catchAsync from '../utils/catchAsync.ts';
import { Hono } from 'hono';

const chatRoutes = new Hono();

chatRoutes.use('*', authMiddleware);

chatRoutes.get('/', catchAsync(chatController.getMessages));
chatRoutes.post('/', catchAsync(chatController.sendMessage));
chatRoutes.delete('/', catchAsync(chatController.clearHistory));

export default chatRoutes;
