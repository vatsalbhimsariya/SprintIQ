import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListTodo,
  FolderKanban,
  TrendingUp,
  ArrowRight,
  Calendar,
  Loader2,
} from 'lucide-react';
import { useDashboard } from '../hooks/useTasks';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import {
  getStatusBadgeClass,
  getPriorityBadgeClass,
  getStatusLabel,
  getPriorityLabel,
  formatDate,
  isOverdue,
  getInitials,
} from '../lib/utils';

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number | string;
  sublabel?: string;
  gradient: string;
  iconBg: string;
}> = ({ icon, label, value, sublabel, gradient, iconBg }) => (
  <div className={`stat-card relative overflow-hidden`}>
    <div className={`absolute inset-0 opacity-10 ${gradient}`} />
    <div className="relative z-10">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-3xl font-bold text-slate-50">{value}</p>
      <p className="text-sm font-medium text-slate-300 mt-1">{label}</p>
      {sublabel && <p className="text-xs text-slate-500 mt-0.5">{sublabel}</p>}
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) {
    return (
      <>
        <Header title="Dashboard" subtitle="Your project overview" />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            <p className="text-slate-400 text-sm">Loading dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  if (isError || !data) {
    return (
      <>
        <Header title="Dashboard" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center glass-card p-8">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <p className="text-slate-300 font-medium">Failed to load dashboard</p>
            <p className="text-slate-500 text-sm mt-1">Check your connection and try again</p>
          </div>
        </div>
      </>
    );
  }

  const { metrics, priorityBreakdown, recentTasks } = data;

  return (
    <>
      <Header title="Dashboard" subtitle={`Welcome back, ${user?.name}!`} />

      <div className="flex-1 p-8 space-y-8 animate-fade-in overflow-y-auto">
        {/* Greeting */}
        <div>
          <h2 className="page-title">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
            <span className="text-gradient">{user?.name?.split(' ')[0]}</span> 👋
          </h2>
          <p className="page-subtitle">
            Here's what's happening across your projects today.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            icon={<ListTodo size={20} className="text-slate-300" />}
            label="Total Tasks"
            value={metrics.totalTasks}
            gradient="bg-gradient-to-br from-slate-500 to-slate-700"
            iconBg="bg-slate-700/50 border border-slate-600/50"
          />
          <StatCard
            icon={<Clock size={20} className="text-amber-400" />}
            label="In Progress"
            value={metrics.inProgressTasks}
            gradient="bg-gradient-to-br from-amber-500 to-orange-600"
            iconBg="bg-amber-500/20 border border-amber-500/30"
          />
          <StatCard
            icon={<CheckCircle2 size={20} className="text-emerald-400" />}
            label="Completed"
            value={metrics.completedTasks}
            gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
            iconBg="bg-emerald-500/20 border border-emerald-500/30"
          />
          <StatCard
            icon={<ListTodo size={20} className="text-blue-400" />}
            label="To Do"
            value={metrics.todoTasks}
            gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
            iconBg="bg-blue-500/20 border border-blue-500/30"
          />
          <StatCard
            icon={<AlertTriangle size={20} className="text-red-400" />}
            label="Overdue"
            value={metrics.overdueTasks}
            gradient="bg-gradient-to-br from-red-500 to-rose-600"
            iconBg="bg-red-500/20 border border-red-500/30"
          />
          <StatCard
            icon={<FolderKanban size={20} className="text-brand-400" />}
            label="Projects"
            value={metrics.totalProjects}
            gradient="bg-gradient-to-br from-brand-500 to-purple-600"
            iconBg="bg-brand-500/20 border border-brand-500/30"
          />
        </div>

        {/* Progress + Priority Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Completion Rate */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-200">Overall Completion</h3>
              <TrendingUp size={18} className="text-brand-400" />
            </div>
            <div className="flex items-end gap-4 mb-4">
              <span className="text-5xl font-bold text-gradient">{metrics.completionRate}%</span>
              <span className="text-slate-500 text-sm pb-2">tasks completed</span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${metrics.completionRate}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>{metrics.completedTasks} done</span>
              <span>{metrics.totalTasks - metrics.completedTasks} remaining</span>
            </div>
          </div>

          {/* Priority Breakdown */}
          <div className="glass-card p-6">
            <h3 className="text-base font-semibold text-slate-200 mb-4">Priority Breakdown</h3>
            <div className="space-y-3">
              {['HIGH', 'MEDIUM', 'LOW'].map((p) => {
                const item = priorityBreakdown.find((pb) => pb.priority === p);
                const count = item?.count || 0;
                const pct = metrics.totalTasks > 0 ? (count / metrics.totalTasks) * 100 : 0;
                const colors = {
                  HIGH: { bar: 'bg-red-500', text: 'text-red-400' },
                  MEDIUM: { bar: 'bg-amber-500', text: 'text-amber-400' },
                  LOW: { bar: 'bg-blue-500', text: 'text-blue-400' },
                } as const;
                const c = colors[p as 'HIGH' | 'MEDIUM' | 'LOW'];
                return (
                  <div key={p}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-sm font-medium ${c.text}`}>{getPriorityLabel(p as 'LOW' | 'MEDIUM' | 'HIGH')}</span>
                      <span className="text-xs text-slate-500">{count} tasks</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${c.bar} rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6">
          <div className="section-header">
            <div>
              <h3 className="text-base font-semibold text-slate-200">Recent Tasks</h3>
              <p className="text-xs text-slate-500 mt-0.5">Latest activity across your projects</p>
            </div>
            <Link to="/projects" className="btn-secondary text-sm py-2">
              View Projects <ArrowRight size={14} />
            </Link>
          </div>

          {recentTasks.length === 0 ? (
            <div className="text-center py-12">
              <ListTodo className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">No tasks yet</p>
              <p className="text-slate-600 text-sm mt-1">Tasks will appear here once created</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentTasks.map((task) => {
                const overdue = isOverdue(task.dueDate, task.status);
                return (
                  <div key={task.id} className="py-3 flex items-center gap-4 group hover:bg-white/5 px-2 rounded-lg -mx-2 transition-colors">
                    {/* Task info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500">{task.project?.name}</span>
                        {task.dueDate && (
                          <>
                            <span className="text-slate-700">•</span>
                            <div className={`flex items-center gap-1 text-xs ${overdue ? 'text-red-400' : 'text-slate-500'}`}>
                              <Calendar size={11} />
                              {formatDate(task.dueDate)}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={getPriorityBadgeClass(task.priority)}>
                        {getPriorityLabel(task.priority)}
                      </span>
                      <span className={getStatusBadgeClass(task.status)}>
                        {getStatusLabel(task.status)}
                      </span>
                      {task.assignee && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold" title={task.assignee.name}>
                          {getInitials(task.assignee.name)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
