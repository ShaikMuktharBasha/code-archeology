import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppLayoutProps {
  title?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ title }) => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-charcoal-900 text-slate-100">
      {/* Subtle ambient futuristic backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 right-1/4 w-[650px] h-[350px] bg-indigo-600/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[300px] bg-cyan-500/5 blur-[130px] rounded-full" />
        <div className="absolute inset-0 bg-cyber-grid opacity-70" />
      </div>

      {/* Sidebar navigation */}
      <Sidebar activeRepoId={id || 'repo-sample-1'} />

      {/* Main Content Pane */}
      <div className="relative z-10 flex flex-col flex-1 h-screen overflow-hidden">
        <Header title={title} activeRepoId={id || 'repo-sample-1'} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
