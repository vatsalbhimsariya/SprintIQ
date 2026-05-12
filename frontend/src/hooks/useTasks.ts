import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Task, TaskStatus, TaskPriority, DashboardData } from '../types';

interface TasksResponse { tasks: Task[] }
interface TaskResponse { task: Task }

// ─── Task Hooks ───────────────────────────────────────────────────────────────

export const useTasks = (projectId: string) =>
  useQuery({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      const res = await api.get<TasksResponse>(`/projects/${projectId}/tasks`);
      return res.data.tasks;
    },
    enabled: !!projectId,
  });

interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
  assigneeId?: string | null;
}

export const useCreateTask = (projectId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateTaskInput) => {
      const res = await api.post<TaskResponse>(`/projects/${projectId}/tasks`, data);
      return res.data.task;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks', projectId] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useUpdateTaskStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: TaskStatus }) => {
      const res = await api.patch<TaskResponse>(`/tasks/${taskId}/status`, { status });
      return res.data.task;
    },
    onSuccess: (task) => {
      qc.invalidateQueries({ queryKey: ['tasks', task.projectId] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
  assigneeId?: string | null;
}

export const useUpdateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, data }: { taskId: string; data: UpdateTaskInput }) => {
      const res = await api.put<TaskResponse>(`/tasks/${taskId}`, data);
      return res.data.task;
    },
    onSuccess: (task) => {
      qc.invalidateQueries({ queryKey: ['tasks', task.projectId] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useDeleteTask = (projectId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (taskId: string) => {
      await api.delete(`/tasks/${taskId}`);
      return taskId;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks', projectId] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

// ─── Dashboard Hooks ─────────────────────────────────────────────────────────

export const useDashboard = () =>
  useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await api.get<DashboardData>('/dashboard/metrics');
      return res.data;
    },
    refetchInterval: 30000, // Refresh every 30s
  });
