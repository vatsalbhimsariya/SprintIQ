import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../lib/utils';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 px-8 flex items-center justify-between border-b border-white/10 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
      {/* Left: Page Title */}
      <div>
        <h2 className="text-lg font-semibold text-slate-100 leading-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button
          id="search-btn"
          className="p-2 text-slate-500 hover:text-slate-300 hover-white-8 rounded-xl transition-all duration-200"
          title="Search (coming soon)"
        >
          <Search size={18} />
        </button>
        <button
          id="notifications-btn"
          className="p-2 text-slate-500 hover:text-slate-300 hover-white-8 rounded-xl transition-all duration-200 relative"
          title="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
            {getInitials(user?.name || 'U')}
          </div>
          <span className="text-sm font-medium text-slate-300 hidden md:block">{user?.name}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
