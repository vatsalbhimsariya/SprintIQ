import { Router } from 'express';
import {
  getTasks,
  createTask,
  updateTaskStatus,
  updateTask,
  deleteTask,
} from '../controllers/task.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createTaskSchema,
  updateTaskStatusSchema,
  updateTaskSchema,
} from '../utils/validators';

export const taskRouter = Router();

// All task routes require authentication
taskRouter.use(authenticate);

// Project-scoped task routes
taskRouter.get('/projects/:projectId/tasks', getTasks);
taskRouter.post(
  '/projects/:projectId/tasks',
  requireAdmin,
  validate(createTaskSchema),
  createTask
);

// Task-specific routes
taskRouter.patch(
  '/tasks/:taskId/status',
  validate(updateTaskStatusSchema),
  updateTaskStatus
);
taskRouter.put('/tasks/:taskId', requireAdmin, validate(updateTaskSchema), updateTask);
taskRouter.delete('/tasks/:taskId', requireAdmin, deleteTask);
