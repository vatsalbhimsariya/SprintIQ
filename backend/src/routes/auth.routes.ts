import { Router } from 'express';
import { register, login, getMe, getAllUsers } from '../controllers/auth.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../utils/validators';

export const authRouter = Router();

// Public routes
authRouter.post('/register', validate(registerSchema), register);
authRouter.post('/login', validate(loginSchema), login);

// Protected routes
authRouter.get('/me', authenticate, getMe);
authRouter.get('/users', authenticate, requireAdmin, getAllUsers);
