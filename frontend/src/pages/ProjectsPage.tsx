import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  FolderKanban,
  Loader2,
  ArrowRight,
  Users,
  CheckSquare,
  Trash2,
  Calendar,
} from 'lucide-react';
import { useProjects, useDeleteProject } from '../hooks/useProjects';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import CreateProjectModal from '../components/CreateProjectModal';
import { formatDate } from '../lib/utils';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../lib/api';

const ProjectsPage: React.FC = () => {
  const { user } = useAuth();
  const { data: projects = [], isLoading, isError } = useProjects();
  const deleteProject = useDeleteProject();
  const [showModal, setShowModal] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete project "${name}"? This will also delete all its tasks.`)) return;
    try {
      await deleteProject.mutateAsync(id);
      toast.success('Project deleted');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <>
      <Header title="Projects" subtitle={`${projects.length} project${projects.length !== 1 ? 's' : ''}`} />

      <div className="flex-1 p-8 overflow-y-auto">
        {/* Page Header */}
        <div className="section-header mb-8">
          <div>
            <h2 className="page-title">Projects</h2>
            <p className="page-subtitle">
              {isAdmin
                ? 'Manage all projects and their teams'
                : 'Projects you are assigned to'}
            </p>
          </div>
          {isAdmin && (
            <button
              id="create-project-btn"
              onClick={() => setShowModal(true)}
              className="btn-primary"
            >
              <Plus size={16} /> New Project
            </button>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
              <p className="text-slate-400 text-sm">Loading projects...</p>
            </div>
          </div>
        ) : isError ? (
          <div className="text-center glass-card p-12">
            <FolderKanban className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <p className="text-slate-300 font-medium">Failed to load projects</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center glass-card p-16 animate-fade-in">
            <FolderKanban className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No projects yet</h3>
            <p className="text-slate-500 text-sm mb-6">
              {isAdmin ? 'Create your first project to get started.' : 'You haven\'t been added to any projects yet.'}
            </p>
            {isAdmin && (
              <button
                id="create-first-project-btn"
                onClick={() => setShowModal(true)}
                className="btn-primary"
              >
                <Plus size={16} /> Create Project
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
            {projects.map((project) => (
              <div
                key={project.id}
                className="glass-card p-6 group hover:border-brand-500/30 transition-all duration-300 flex flex-col"
              >
                {/* Project Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/30 to-purple-600/30 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                      <FolderKanban size={18} className="text-brand-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-100 group-hover:text-brand-300 transition-colors line-clamp-1">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <Calendar size={11} />
                        {formatDate(project.createdAt)}
                      </div>
                    </div>
                  </div>
                  {isAdmin && (
                    <button
                      id={`delete-project-${project.id}`}
                      onClick={() => handleDelete(project.id, project.name)}
                      disabled={deleteProject.isPending}
                      className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
                  {project.description || 'No description provided.'}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 py-3 border-y border-white/10">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <CheckSquare size={13} className="text-brand-400" />
                    <span><strong className="text-slate-200">{project._count?.tasks || 0}</strong> tasks</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Users size={13} className="text-purple-400" />
                    <span><strong className="text-slate-200">{project.members.length}</strong> members</span>
                  </div>
                </div>

                {/* Member Avatars */}
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {project.members.slice(0, 4).map((m) => (
                      <div
                        key={m.id}
                        title={m.user.name}
                        className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 border-2 border-slate-900 flex items-center justify-center text-white text-[10px] font-bold"
                      >
                        {m.user.name.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {project.members.length > 4 && (
                      <div className="w-7 h-7 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-slate-400 text-[10px] font-bold">
                        +{project.members.length - 4}
                      </div>
                    )}
                  </div>
                  <Link
                    id={`view-project-${project.id}`}
                    to={`/projects/${project.id}`}
                    className="btn-secondary text-xs py-1.5 px-3"
                  >
                    Open <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && <CreateProjectModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default ProjectsPage;
