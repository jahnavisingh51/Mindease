import * as chatService from '../services/chatService.ts';
import catchAsync from '../utils/catchAsync.ts';
import { Context } from 'hono';

export const sendMessage = catchAsync(async (c: Context) => {
  const userId = c.get('userId');
  const { message } = await c.req.json();
  const response = await chatService.sendMessage(userId, message);
  return c.json(response);
});

export const getMessages = catchAsync(async (c: Context) => {
  const userId = c.get('userId');
  const messages = await chatService.getMessages(userId);
  return c.json(messages);
});

export const clearHistory = catchAsync(async (c: Context) => {
  const userId = c.get('userId');
  await chatService.clearHistory(userId);
  return c.json({ message: 'Chat history cleared' });
});
