import { z } from 'zod';

// ─── Auth Schemas ────────────────────────────────────────────────────────────
export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    role: z.enum(['ADMIN', 'MEMBER']).optional().default('MEMBER'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

// ─── Project Schemas ─────────────────────────────────────────────────────────
export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Project name is required').max(200),
    description: z.string().max(1000).optional(),
    memberIds: z.array(z.string()).optional().default([]),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    description: z.string().max(1000).optional(),
    memberIds: z.array(z.string()).optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Project ID is required'),
  }),
});

// ─── Task Schemas ─────────────────────────────────────────────────────────────
export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Task title is required').max(300),
    description: z.string().max(2000).optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']).optional().default('TODO'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional().default('MEDIUM'),
    dueDate: z.string().datetime().optional().nullable(),
    assigneeId: z.string().optional().nullable(),
  }),
  params: z.object({
    projectId: z.string().min(1),
  }),
});

export const updateTaskStatusSchema = z.object({
  body: z.object({
    status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']),
  }),
  params: z.object({
    taskId: z.string().min(1),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(300).optional(),
    description: z.string().max(2000).optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    dueDate: z.string().datetime().optional().nullable(),
    assigneeId: z.string().optional().nullable(),
  }),
  params: z.object({
    taskId: z.string().min(1),
  }),
});
