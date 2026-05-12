import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2, Plus } from 'lucide-react';
import { useCreateTask } from '../hooks/useTasks';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../lib/api';
import type { User } from '../types';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300),
  description: z.string().max(2000).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface CreateTaskModalProps {
  projectId: string;
  members: { user: Pick<User, 'id' | 'name' | 'email'> }[];
  onClose: () => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ projectId, members, onClose }) => {
  const createTask = useCreateTask(projectId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: { priority: 'MEDIUM' },
  });

  const onSubmit = async (values: TaskFormValues) => {
    try {
      await createTask.mutateAsync({
        ...values,
        dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
        assigneeId: values.assigneeId || null,
      });
      toast.success('Task created successfully!');
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-md p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
              <Plus className="w-5 h-5 text-brand-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100">New Task</h3>
          </div>
          <button
            id="close-task-modal-btn"
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-300 hover:bg-white/10 rounded-xl transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="task-title" className="label">Task Title *</label>
            <input
              id="task-title"
              {...register('title')}
              className="input-field"
              placeholder="What needs to be done?"
            />
            {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="task-desc" className="label">Description</label>
            <textarea
              id="task-desc"
              {...register('description')}
              className="input-field resize-none"
              rows={3}
              placeholder="Add more details..."
            />
          </div>

          {/* Priority & Due Date row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-priority" className="label">Priority</label>
              <select id="task-priority" {...register('priority')} className="input-field">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div>
              <label htmlFor="task-due" className="label">Due Date</label>
              <input
                id="task-due"
                type="date"
                {...register('dueDate')}
                className="input-field"
                style={{ colorScheme: 'dark' }}
              />
            </div>
          </div>

          {/* Assignee */}
          <div>
            <label htmlFor="task-assignee" className="label">Assign To</label>
            <select id="task-assignee" {...register('assigneeId')} className="input-field">
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m.user.id} value={m.user.id}>
                  {m.user.name} ({m.user.email})
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button
              id="submit-task-btn"
              type="submit"
              disabled={isSubmitting || createTask.isPending}
              className="btn-primary flex-1"
            >
              {(isSubmitting || createTask.isPending) ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
