import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderTree,
  Network,
  BotMessageSquare,
  Activity,
  UploadCloud,
  Settings,
  GitBranch,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { clsx } from 'clsx';
import { Badge } from '../common/Badge';

interface SidebarProps {
  activeRepoId?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeRepoId = 'repo-sample-1' }) => {
  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: `/explorer/${activeRepoId}`,
      label: 'Repository Explorer',
      icon: FolderTree,
      badge: null,
    },
    {
      to: `/architecture/${activeRepoId}`,
      label: 'Architecture Graph',
      icon: Network,
      badge: 'DAG',
    },
    {
      to: `/assistant/${activeRepoId}`,
      label: 'AI Code Assistant',
      icon: BotMessageSquare,
      badge: 'Gemini',
    },
    {
      to: `/impact/${activeRepoId}`,
      label: 'Impact Analysis',
      icon: Activity,
      badge: null,
    },
    {
      to: '/upload',
      label: 'Ingest Repository',
      icon: UploadCloud,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 h-screen bg-charcoal-900 border-r border-charcoal-800 flex flex-col flex-shrink-0 select-none">
      {/* Brand logo header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-charcoal-800">
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-sm tracking-tight text-white block">
              Code Archaeologist
            </span>
            <span className="text-[10px] text-slate-400 font-mono block">v1.0.0-preview</span>
          </div>
        </NavLink>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Platform
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-charcoal-800 text-indigo-300 border border-charcoal-700 shadow-subtle'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-charcoal-850'
                )
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <Badge variant="indigo" size="sm">
                  {item.badge}
                </Badge>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Active Repo Context Card */}
      <div className="p-3 border-t border-charcoal-800">
        <div className="bg-charcoal-850 border border-charcoal-750 rounded-lg p-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
              <span>Active Target</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-xs font-semibold text-slate-200 truncate">
            code-archaeologist-core
          </p>
          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-charcoal-800 text-[11px] text-slate-400 font-mono">
            <span>84 files</span>
            <span>420 symbols</span>
          </div>
        </div>
      </div>

      {/* Settings Footer */}
      <div className="p-3 border-t border-charcoal-800">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            clsx(
              'flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all',
              isActive
                ? 'bg-charcoal-800 text-indigo-300'
                : 'text-slate-400 hover:text-slate-200 hover:bg-charcoal-850'
            )
          }
        >
          <div className="flex items-center gap-2.5">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </NavLink>
      </div>
    </aside>
  );
};
