import * as dashboardController from '../controllers/dashboardController.ts';
import { authMiddleware } from '../middlewares/authMiddleware.ts';
import catchAsync from '../utils/catchAsync.ts';
import { Hono } from 'hono';

const dashboardRoutes = new Hono();

dashboardRoutes.use('*', authMiddleware);

dashboardRoutes.get('/summary', catchAsync(dashboardController.getDashboardSummary));

export default dashboardRoutes;
