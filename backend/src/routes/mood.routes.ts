import * as moodController from '../controllers/moodController.ts';
import { authMiddleware } from '../middlewares/authMiddleware.ts';
import catchAsync from '../utils/catchAsync.ts';
import { Hono } from 'hono';

const moodRoutes = new Hono();

moodRoutes.use('*', authMiddleware);

moodRoutes.get('/', catchAsync(moodController.getMoods));
moodRoutes.post('/', catchAsync(moodController.logMood));
moodRoutes.get('/stats', catchAsync(moodController.getStats));
moodRoutes.get('/alert', catchAsync(moodController.checkSmartAlert));

export default moodRoutes;
