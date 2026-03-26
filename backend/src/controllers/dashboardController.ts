import * as dashboardService from '../services/dashboardService.ts';
import catchAsync from '../utils/catchAsync.ts';
import { Context } from 'hono';

export const getDashboardSummary = catchAsync(async (c: Context) => {
  const userId = c.get('userId');
  const summary = await dashboardService.getDashboardSummary(userId);
  return c.json(summary);
});
