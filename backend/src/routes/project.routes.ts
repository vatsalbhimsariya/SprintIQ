import { Router } from 'express';
import {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
} from '../controllers/project.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createProjectSchema, updateProjectSchema } from '../utils/validators';

export const projectRouter = Router();

// All project routes require authentication
projectRouter.use(authenticate);

projectRouter.get('/', getProjects);
projectRouter.post('/', requireAdmin, validate(createProjectSchema), createProject);
projectRouter.get('/:id', getProjectById);
projectRouter.put('/:id', requireAdmin, validate(updateProjectSchema), updateProject);
projectRouter.delete('/:id', requireAdmin, deleteProject);
