import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2, FolderPlus } from 'lucide-react';
import { useCreateProject } from '../hooks/useProjects';
import { useGetUsers } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../lib/api';

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(200),
  description: z.string().max(1000).optional(),
  memberIds: z.array(z.string()).optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface CreateProjectModalProps {
  onClose: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose }) => {
  const createProject = useCreateProject();
  const { data: users = [] } = useGetUsers();
  const [selectedMembers, setSelectedMembers] = React.useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({ resolver: zodResolver(projectSchema) });

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      await createProject.mutateAsync({ ...values, memberIds: selectedMembers });
      toast.success('Project created!');
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
              <FolderPlus className="w-5 h-5 text-brand-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100">New Project</h3>
          </div>
          <button
            id="close-project-modal-btn"
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-300 hover:bg-white/10 rounded-xl transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="proj-name" className="label">Project Name *</label>
            <input
              id="proj-name"
              {...register('name')}
              className="input-field"
              placeholder="e.g. Website Redesign"
            />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="proj-desc" className="label">Description</label>
            <textarea
              id="proj-desc"
              {...register('description')}
              className="input-field resize-none"
              rows={3}
              placeholder="What is this project about?"
            />
          </div>

          {/* Member selection */}
          {users.length > 0 && (
            <div>
              <label className="label">Add Members</label>
              <div className="max-h-40 overflow-y-auto space-y-2 p-2 bg-white/5 rounded-xl border border-white/10">
                {users.map((u) => (
                  <label
                    key={u.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      id={`member-${u.id}`}
                      checked={selectedMembers.includes(u.id)}
                      onChange={() => toggleMember(u.id)}
                      className="w-4 h-4 accent-brand-500 rounded"
                    />
                    <div>
                      <p className="text-sm text-slate-200">{u.name}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </div>
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-md ${
                      u.role === 'ADMIN' ? 'bg-brand-500/20 text-brand-400' : 'bg-slate-700 text-slate-400'
                    }`}>
                      {u.role}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-1">{selectedMembers.length} member(s) selected</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button
              id="submit-project-btn"
              type="submit"
              disabled={isSubmitting || createProject.isPending}
              className="btn-primary flex-1"
            >
              {(isSubmitting || createProject.isPending) ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <FolderPlus size={16} />
              )}
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
