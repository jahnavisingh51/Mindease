import * as moodService from '../services/moodService.ts';
import catchAsync from '../utils/catchAsync.ts';
import { Context } from 'hono';

export const logMood = catchAsync(async (c: Context) => {
  const userId = c.get('userId');
  const { mood, label, note } = await c.req.json();
  const entry = await moodService.logMood(userId, Number(mood), label, note);
  return c.json(entry);
});

export const getMoods = catchAsync(async (c: Context) => {
  const userId = c.get('userId');
  const moods = await moodService.getMoods(userId);
  return c.json(moods);
});

export const getStats = catchAsync(async (c: Context) => {
  const userId = c.get('userId');
  const stats = await moodService.getStats(userId);
  return c.json(stats);
});

export const checkSmartAlert = catchAsync(async (c: Context) => {
  const userId = c.get('userId');
  const alert = await moodService.checkSmartAlert(userId);
  return c.json({ alert });
});
