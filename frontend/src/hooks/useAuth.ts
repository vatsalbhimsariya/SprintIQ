import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { User, AuthResponse } from '../types';

// ─── Auth Hooks ───────────────────────────────────────────────────────────────

export const useGetMe = () =>
  useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await api.get<{ user: User }>('/auth/me');
      return res.data.user;
    },
    staleTime: 5 * 60 * 1000,
  });

export const useGetUsers = () =>
  useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get<{ users: User[] }>('/auth/users');
      return res.data.users;
    },
    staleTime: 2 * 60 * 1000,
  });

interface LoginInput { email: string; password: string; }
interface RegisterInput { name: string; email: string; password: string; role?: 'ADMIN' | 'MEMBER'; }

export const useLogin = () =>
  useMutation({
    mutationFn: async (data: LoginInput) => {
      const res = await api.post<AuthResponse>('/auth/login', data);
      return res.data;
    },
  });

export const useRegister = () =>
  useMutation({
    mutationFn: async (data: RegisterInput) => {
      const res = await api.post<AuthResponse>('/auth/register', data);
      return res.data;
    },
  });
