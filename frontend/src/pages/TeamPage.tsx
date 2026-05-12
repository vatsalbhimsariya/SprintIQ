import React from 'react';
import { Users, Shield, User, Mail, Calendar, Loader2 } from 'lucide-react';
import { useGetUsers } from '../hooks/useAuth';
import Header from '../components/Header';
import { formatDate, getInitials } from '../lib/utils';

const TeamPage: React.FC = () => {
  const { data: users = [], isLoading } = useGetUsers();

  const admins = users.filter((u) => u.role === 'ADMIN');
  const members = users.filter((u) => u.role === 'MEMBER');

  return (
    <>
      <Header title="Team Members" subtitle={`${users.length} total members`} />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="section-header mb-8">
          <div>
            <h2 className="page-title">Team</h2>
            <p className="page-subtitle">All registered users in the system</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass-card px-4 py-2 flex items-center gap-2">
              <Shield size={14} className="text-brand-400" />
              <span className="text-sm text-slate-300">{admins.length} Admin{admins.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="glass-card px-4 py-2 flex items-center gap-2">
              <User size={14} className="text-purple-400" />
              <span className="text-sm text-slate-300">{members.length} Member{members.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Admins */}
            {admins.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Shield size={16} className="text-brand-400" />
                  <h3 className="text-sm font-semibold text-brand-400 uppercase tracking-wider">
                    Administrators
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {admins.map((u) => (
                    <UserCard key={u.id} user={u} />
                  ))}
                </div>
              </div>
            )}

            {/* Members */}
            {members.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Users size={16} className="text-purple-400" />
                  <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">
                    Members
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {members.map((u) => (
                    <UserCard key={u.id} user={u} />
                  ))}
                </div>
              </div>
            )}

            {users.length === 0 && (
              <div className="text-center glass-card p-16">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No team members found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

const UserCard: React.FC<{ user: { id: string; name: string; email: string; role: string; createdAt?: string } }> = ({ user }) => (
  <div className="glass-card p-5 hover:border-white/20 transition-all duration-200 group">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-base flex-shrink-0 ${
        user.role === 'ADMIN'
          ? 'bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/30'
          : 'bg-gradient-to-br from-purple-500 to-purple-700'
      }`}>
        {getInitials(user.name)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-100 truncate">{user.name}</p>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
            user.role === 'ADMIN'
              ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
              : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
          }`}>
            {user.role}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Mail size={11} className="text-slate-600" />
          <p className="text-xs text-slate-500 truncate">{user.email}</p>
        </div>
        {user.createdAt && (
          <div className="flex items-center gap-1 mt-0.5">
            <Calendar size={11} className="text-slate-600" />
            <p className="text-xs text-slate-600">Joined {formatDate(user.createdAt)}</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default TeamPage;
