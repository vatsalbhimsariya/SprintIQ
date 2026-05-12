import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Plus,
  Loader2,
  AlertTriangle,
  ArrowLeft,
  Users,
  CheckSquare,
  ListTodo,
  Clock,
  Filter,
} from 'lucide-react';
import { useProject } from '../hooks/useProjects';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import TaskCard from '../components/TaskCard';
import CreateTaskModal from '../components/CreateTaskModal';
import { getStatusLabel, getPriorityLabel } from '../lib/utils';
import type { TaskStatus, TaskPriority } from '../types';

const STATUS_COLUMNS: { status: TaskStatus; label: string; icon: React.ReactNode; color: string }[] = [
  { status: 'TODO', label: 'To Do', icon: <ListTodo size={16} />, color: 'text-slate-400' },
  { status: 'IN_PROGRESS', label: 'In Progress', icon: <Clock size={16} />, color: 'text-amber-400' },
  { status: 'COMPLETED', label: 'Completed', icon: <CheckSquare size={16} />, color: 'text-emerald-400' },
];

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: project, isLoading: projectLoading } = useProject(id!);
  const { data: tasks = [], isLoading: tasksLoading } = useTasks(id!);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'ALL'>('ALL');

  const isAdmin = user?.role === 'ADMIN';
  const isLoading = projectLoading || tasksLoading;

  const filteredTasks = tasks.filter(
    (t) => priorityFilter === 'ALL' || t.priority === priorityFilter
  );

  const getTasksByStatus = (status: TaskStatus) =>
    filteredTasks.filter((t) => t.status === status);

  if (isLoading) {
    return (
      <>
        <Header title="Project Details" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        </div>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Header title="Not Found" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center glass-card p-10">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <p className="text-slate-300 font-medium">Project not found</p>
            <Link to="/projects" className="btn-secondary mt-4 inline-flex">
              <ArrowLeft size={14} /> Back to Projects
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title={project.name} subtitle={`${tasks.length} tasks • ${project.members.length} members`} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Project toolbar */}
        <div className="px-8 py-4 border-b border-white/10 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Link to="/projects" className="p-2 text-slate-500 hover:text-slate-300 hover-white-8 rounded-xl transition-all">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h2 className="text-lg font-semibold text-slate-100">{project.name}</h2>
              {project.description && (
                <p className="text-xs text-slate-500 mt-0.5 max-w-md truncate">{project.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Priority Filter */}
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-slate-500" />
              <select
                id="priority-filter"
                className="input-field text-xs py-1.5 pl-3 pr-8 w-36"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'ALL')}
              >
                <option value="ALL">All Priorities</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            {/* Members */}
            <div className="hidden md:flex -space-x-2">
              {project.members.slice(0, 5).map((m) => (
                <div
                  key={m.id}
                  title={m.user.name}
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 border-2 border-slate-900 flex items-center justify-center text-white text-[10px] font-bold"
                >
                  {m.user.name.charAt(0).toUpperCase()}
                </div>
              ))}
              {project.members.length > 5 && (
                <div className="w-7 h-7 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-slate-400 text-[10px] font-bold">
                  +{project.members.length - 5}
                </div>
              )}
            </div>

            {isAdmin && (
              <button
                id="create-task-btn"
                onClick={() => setShowCreateModal(true)}
                className="btn-primary text-sm"
              >
                <Plus size={15} /> Add Task
              </button>
            )}
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-6 p-8 min-w-max h-full">
            {STATUS_COLUMNS.map((col) => {
              const colTasks = getTasksByStatus(col.status);
              return (
                <div key={col.status} className="w-80 flex flex-col flex-shrink-0">
                  {/* Column header */}
                  <div className="flex items-center gap-2 mb-4 px-1">
                    <span className={col.color}>{col.icon}</span>
                    <h3 className={`text-sm font-semibold ${col.color}`}>{col.label}</h3>
                    <span className="ml-auto text-xs text-slate-600 bg-white/5 rounded-full px-2 py-0.5 border border-white/10">
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Tasks */}
                  <div className="flex-1 space-y-3 overflow-y-auto pr-1 pb-4">
                    {colTasks.length === 0 ? (
                      <div className="h-20 flex items-center justify-center rounded-xl border-2 border-dashed border-white/10 text-slate-700 text-xs">
                        No {getStatusLabel(col.status)} tasks
                      </div>
                    ) : (
                      colTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          projectId={id!}
                          projectMembers={project.members}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateTaskModal
          projectId={id!}
          members={project.members}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </>
  );
};

export default ProjectDetailPage;
