import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { createError } from '../middlewares/error.middleware';

// GET /api/projects/:projectId/tasks
export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { userId, role } = req.user!;

    // Verify project exists and user has access
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { members: true },
    });

    if (!project) {
      throw createError('Project not found.', 404);
    }

    if (role !== 'ADMIN') {
      const isMember = project.members.some((m) => m.userId === userId);
      if (!isMember) {
        throw createError('You do not have access to this project.', 403);
      }
    }

    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ tasks });
  } catch (error) {
    next(error);
  }
};

// POST /api/projects/:projectId/tasks (Admin only)
export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { title, description, status, priority, dueDate, assigneeId } = req.body;

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      throw createError('Project not found.', 404);
    }

    // If assignee specified, validate they are a member of the project
    if (assigneeId) {
      const isMember = await prisma.projectMember.findUnique({
        where: { projectId_userId: { projectId, userId: assigneeId } },
      });
      if (!isMember) {
        throw createError('Assignee must be a member of this project.', 400);
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'TODO',
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assigneeId: assigneeId || null,
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/tasks/:taskId/status (Assignee or Admin)
export const updateTaskStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const { userId, role } = req.user!;

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw createError('Task not found.', 404);
    }

    // Members can only update their assigned tasks
    if (role !== 'ADMIN' && task.assigneeId !== userId) {
      throw createError('You can only update the status of tasks assigned to you.', 403);
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
      },
    });

    res.json({ message: 'Task status updated', task: updatedTask });
  } catch (error) {
    next(error);
  }
};

// PUT /api/tasks/:taskId (Admin only - full update)
export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { title, description, status, priority, dueDate, assigneeId } = req.body;

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw createError('Task not found.', 404);
    }

    // If changing assignee, validate they are a member
    if (assigneeId !== undefined && assigneeId !== null) {
      const isMember = await prisma.projectMember.findUnique({
        where: { projectId_userId: { projectId: task.projectId, userId: assigneeId } },
      });
      if (!isMember) {
        throw createError('Assignee must be a member of this project.', 400);
      }
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(assigneeId !== undefined && { assigneeId: assigneeId || null }),
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
      },
    });

    res.json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tasks/:taskId (Admin only)
export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { taskId } = req.params;

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw createError('Task not found.', 404);
    }

    await prisma.task.delete({ where: { id: taskId } });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};
