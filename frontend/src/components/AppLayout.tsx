import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AppLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Decorative background gradient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-64 w-96 h-96 bg-brand-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/8 rounded-full blur-3xl" />
      </div>

      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative z-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
