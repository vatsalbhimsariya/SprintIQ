import { Router } from 'express';
import { getDashboardMetrics } from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/auth.middleware';

export const dashboardRouter = Router();

dashboardRouter.get('/metrics', authenticate, getDashboardMetrics);
