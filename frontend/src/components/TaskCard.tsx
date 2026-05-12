import React from 'react';
import { cn, getStatusBadgeClass, getPriorityBadgeClass, getStatusLabel, getPriorityLabel, formatDate, isOverdue, getInitials } from '../lib/utils';
import type { Task, TaskStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { useUpdateTaskStatus, useDeleteTask, useUpdateTask } from '../hooks/useTasks';
import { Calendar, Trash2, AlertTriangle, Edit2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../lib/api';

interface TaskCardProps {
  task: Task;
  projectId: string;
  projectMembers?: { user: { id: string; name: string; email: string } }[];
}

const TaskCard: React.FC<TaskCardProps> = ({ task, projectId, projectMembers = [] }) => {
  const { user } = useAuth();
  const [editing, setEditing] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(task.title);
  const [editStatus, setEditStatus] = React.useState<TaskStatus>(task.status);

  const updateStatus = useUpdateTaskStatus();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask(projectId);

  const isAdmin = user?.role === 'ADMIN';
  const isAssignee = task.assigneeId === user?.id;
  const overdue = isOverdue(task.dueDate, task.status);

  const canChangeStatus = isAdmin || isAssignee;

  const handleStatusChange = async (status: TaskStatus) => {
    if (!canChangeStatus) return;
    try {
      await updateStatus.mutateAsync({ taskId: task.id, status });
      toast.success('Status updated');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleSaveEdit = async () => {
    try {
      await updateTask.mutateAsync({
        taskId: task.id,
        data: { title: editTitle, status: editStatus },
      });
      toast.success('Task updated');
      setEditing(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this task?')) return;
    try {
      await deleteTask.mutateAsync(task.id);
      toast.success('Task deleted');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div
      className={cn(
        'glass-card p-4 group animate-fade-in hover:border-white/20 transition-all duration-200',
        overdue && 'border-red-500/30 bg-red-500/5'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              className="input-field text-sm py-1.5 w-full"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              autoFocus
            />
          ) : (
            <h4 className="text-sm font-semibold text-slate-100 leading-snug line-clamp-2">
              {task.title}
            </h4>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          {editing ? (
            <>
              <button
                onClick={handleSaveEdit}
                disabled={updateTask.isPending}
                className="p-1.5 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors"
              >
                <Check size={14} />
              </button>
              <button
                onClick={() => setEditing(false)}
                className="p-1.5 text-slate-400 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <>
              {isAdmin && (
                <button
                  onClick={() => setEditing(true)}
                  className="p-1.5 text-slate-400 hover:text-brand-400 hover:bg-brand-400/10 rounded-lg transition-colors"
                >
                  <Edit2 size={14} />
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={handleDelete}
                  disabled={deleteTask.isPending}
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-500 mb-3 line-clamp-2">{task.description}</p>
      )}

      {/* Badges row */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={getStatusBadgeClass(task.status)}>{getStatusLabel(task.status)}</span>
        <span className={getPriorityBadgeClass(task.priority)}>{getPriorityLabel(task.priority)}</span>
        {overdue && (
          <span className="badge text-red-400 border border-red-500/30 flex items-center gap-1" style={{ backgroundColor: 'rgba(239,68,68,0.15)' }}>
            <AlertTriangle size={10} />
            Overdue
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Due date */}
        <div className={cn('flex items-center gap-1 text-xs', overdue ? 'text-red-400' : 'text-slate-500')}>
          <Calendar size={12} />
          <span>{formatDate(task.dueDate)}</span>
        </div>

        {/* Assignee */}
        {task.assignee ? (
          <div className="flex items-center gap-1.5" title={task.assignee.name}>
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">
              {getInitials(task.assignee.name)}
            </div>
            <span className="text-xs text-slate-400 hidden sm:block">{task.assignee.name}</span>
          </div>
        ) : (
          <span className="text-xs text-slate-600">Unassigned</span>
        )}
      </div>

      {/* Status Changer (for assignee/admin) */}
      {canChangeStatus && !editing && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <select
            id={`task-status-${task.id}`}
            className="w-full input-field text-xs py-1.5"
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
            disabled={updateStatus.isPending}
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
