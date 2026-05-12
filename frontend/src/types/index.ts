// Shared types between frontend and backend

export type Role = 'ADMIN' | 'MEMBER';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface ProjectMember {
  id: string;
  userId: string;
  projectId: string;
  joinedAt: string;
  user: Pick<User, 'id' | 'name' | 'email' | 'role'>;
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  createdBy: Pick<User, 'id' | 'name' | 'email'>;
  members: ProjectMember[];
  tasks?: Task[];
  _count?: { tasks: number };
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  project?: Pick<Project, 'id' | 'name'>;
  assigneeId?: string | null;
  assignee?: Pick<User, 'id' | 'name' | 'email'> | null;
}

export interface DashboardMetrics {
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  overdueTasks: number;
  totalProjects: number;
  completionRate: number;
}

export interface PriorityBreakdown {
  priority: TaskPriority;
  count: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  priorityBreakdown: PriorityBreakdown[];
  recentTasks: Task[];
}

export interface ApiError {
  message: string;
  errors?: { field: string; message: string }[];
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}
