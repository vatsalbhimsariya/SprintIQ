import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Project } from '../types';

interface ProjectsResponse { projects: Project[] }
interface ProjectResponse { project: Project }

// ─── Project Hooks ─────────────────────────────────────────────────────────────

export const useProjects = () =>
  useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await api.get<ProjectsResponse>('/projects');
      return res.data.projects;
    },
  });

export const useProject = (id: string) =>
  useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const res = await api.get<ProjectResponse>(`/projects/${id}`);
      return res.data.project;
    },
    enabled: !!id,
  });

interface CreateProjectInput { name: string; description?: string; memberIds?: string[] }
interface UpdateProjectInput { name?: string; description?: string; memberIds?: string[] }

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateProjectInput) => {
      const res = await api.post<ProjectResponse>('/projects', data);
      return res.data.project;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
};

export const useUpdateProject = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateProjectInput) => {
      const res = await api.put<ProjectResponse>(`/projects/${id}`, data);
      return res.data.project;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      qc.invalidateQueries({ queryKey: ['project', id] });
    },
  });
};

export const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/projects/${id}`);
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
};
