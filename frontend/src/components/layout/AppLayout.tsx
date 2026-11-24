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
    <div className="flex h-screen w-screen overflow-hidden bg-charcoal-900 text-slate-100">
      {/* Sidebar navigation */}
      <Sidebar activeRepoId={id || 'repo-sample-1'} />

      {/* Main Content Pane */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <Header title={title} activeRepoId={id || 'repo-sample-1'} />
        <main className="flex-1 overflow-y-auto bg-charcoal-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
