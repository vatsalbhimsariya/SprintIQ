import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

// GET /api/dashboard/metrics
export const getDashboardMetrics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, role } = req.user!;
    const now = new Date();

    // Determine project filter based on role
    const projectFilter =
      role === 'ADMIN'
        ? {}
        : { members: { some: { userId } } };

    // Get projects accessible to user
    const userProjects = await prisma.project.findMany({
      where: projectFilter,
      select: { id: true },
    });
    const projectIds = userProjects.map((p) => p.id);

    const taskFilter =
      role === 'ADMIN'
        ? {}
        : { projectId: { in: projectIds } };

    // Run all queries in parallel
    const [
      totalTasks,
      todoTasks,
      inProgressTasks,
      completedTasks,
      overdueTasks,
      totalProjects,
      recentTasks,
    ] = await Promise.all([
      prisma.task.count({ where: taskFilter }),
      prisma.task.count({ where: { ...taskFilter, status: 'TODO' } }),
      prisma.task.count({ where: { ...taskFilter, status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { ...taskFilter, status: 'COMPLETED' } }),
      prisma.task.count({
        where: {
          ...taskFilter,
          dueDate: { lt: now },
          status: { not: 'COMPLETED' },
        },
      }),
      prisma.project.count({ where: projectFilter }),
      prisma.task.findMany({
        where: taskFilter,
        include: {
          assignee: { select: { id: true, name: true } },
          project: { select: { id: true, name: true } },
        },
        orderBy: { updatedAt: 'desc' },
        take: 8,
      }),
    ]);

    // Priority breakdown
    const priorityBreakdown = await prisma.task.groupBy({
      by: ['priority'],
      where: taskFilter,
      _count: { priority: true },
    });

    res.json({
      metrics: {
        totalTasks,
        todoTasks,
        inProgressTasks,
        completedTasks,
        overdueTasks,
        totalProjects,
        completionRate:
          totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      },
      priorityBreakdown: priorityBreakdown.map((p) => ({
        priority: p.priority,
        count: p._count.priority,
      })),
      recentTasks,
    });
  } catch (error) {
    next(error);
  }
};
