import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { createError } from '../middlewares/error.middleware';

// GET /api/projects
export const getProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, role } = req.user!;

    // Admins see all projects; members only see their own
    const projects = await prisma.project.findMany({
      where:
        role === 'ADMIN'
          ? undefined
          : { members: { some: { userId } } },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        members: {
          include: { user: { select: { id: true, name: true, email: true, role: true } } },
        },
        _count: { select: { tasks: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ projects });
  } catch (error) {
    next(error);
  }
};

// POST /api/projects (Admin only)
export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description, memberIds = [] } = req.body;
    const { userId } = req.user!;

    // Always include creator as member
    const uniqueMemberIds = [...new Set([userId, ...memberIds])];

    const project = await prisma.project.create({
      data: {
        name,
        description,
        createdById: userId,
        members: {
          create: uniqueMemberIds.map((id: string) => ({ userId: id })),
        },
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        members: {
          include: { user: { select: { id: true, name: true, email: true, role: true } } },
        },
        _count: { select: { tasks: true } },
      },
    });

    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    next(error);
  }
};

// GET /api/projects/:id
export const getProjectById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user!;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        members: {
          include: { user: { select: { id: true, name: true, email: true, role: true } } },
        },
        tasks: {
          include: {
            assignee: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) {
      throw createError('Project not found.', 404);
    }

    // Members can only access projects they belong to
    if (role !== 'ADMIN') {
      const isMember = project.members.some((m) => m.userId === userId);
      if (!isMember) {
        throw createError('You do not have access to this project.', 403);
      }
    }

    res.json({ project });
  } catch (error) {
    next(error);
  }
};

// PUT /api/projects/:id (Admin only)
export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, memberIds } = req.body;
    const { userId } = req.user!;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      throw createError('Project not found.', 404);
    }

    // If memberIds provided, rebuild members list
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    if (memberIds !== undefined) {
      const uniqueMemberIds = [...new Set([userId, ...memberIds])];
      // Delete all existing members and re-create
      await prisma.projectMember.deleteMany({ where: { projectId: id } });
      updateData.members = {
        create: uniqueMemberIds.map((mid: string) => ({ userId: mid })),
      };
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        members: {
          include: { user: { select: { id: true, name: true, email: true, role: true } } },
        },
        _count: { select: { tasks: true } },
      },
    });

    res.json({ message: 'Project updated successfully', project });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/projects/:id (Admin only)
export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      throw createError('Project not found.', 404);
    }

    await prisma.project.delete({ where: { id } });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};
