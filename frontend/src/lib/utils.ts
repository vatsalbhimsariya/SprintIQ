import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isAfter, parseISO } from 'date-fns';
import type { TaskStatus, TaskPriority } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return 'No due date';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'MMM dd, yyyy');
  } catch {
    return 'Invalid date';
  }
}

export function isOverdue(dueDate: string | null | undefined, status: TaskStatus): boolean {
  if (!dueDate || status === 'COMPLETED') return false;
  return isAfter(new Date(), parseISO(dueDate));
}

export function getStatusBadgeClass(status: TaskStatus): string {
  switch (status) {
    case 'TODO':
      return 'badge-todo';
    case 'IN_PROGRESS':
      return 'badge-in-progress';
    case 'COMPLETED':
      return 'badge-completed';
    default:
      return 'badge-todo';
  }
}

export function getPriorityBadgeClass(priority: TaskPriority): string {
  switch (priority) {
    case 'LOW':
      return 'badge-low';
    case 'MEDIUM':
      return 'badge-medium';
    case 'HIGH':
      return 'badge-high';
    default:
      return 'badge-medium';
  }
}

export function getStatusLabel(status: TaskStatus): string {
  switch (status) {
    case 'TODO': return 'To Do';
    case 'IN_PROGRESS': return 'In Progress';
    case 'COMPLETED': return 'Completed';
  }
}

export function getPriorityLabel(priority: TaskPriority): string {
  switch (priority) {
    case 'LOW': return 'Low';
    case 'MEDIUM': return 'Medium';
    case 'HIGH': return 'High';
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
