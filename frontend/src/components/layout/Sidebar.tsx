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
  Cpu,
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
      label: 'Command Center',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: `/explorer/${activeRepoId}`,
      label: 'Code Explorer',
      icon: FolderTree,
      badge: null,
    },
    {
      to: `/architecture/${activeRepoId}`,
      label: 'Architecture DAG',
      icon: Network,
      badge: '3D/DAG',
    },
    {
      to: `/assistant/${activeRepoId}`,
      label: 'Neural Assistant',
      icon: BotMessageSquare,
      badge: 'Gemini',
    },
    {
      to: `/impact/${activeRepoId}`,
      label: 'Blast Radius',
      icon: Activity,
      badge: null,
    },
    {
      to: '/upload',
      label: 'Ingest Repo',
      icon: UploadCloud,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 h-screen bg-charcoal-950/90 backdrop-blur-xl border-r border-charcoal-800/90 flex flex-col flex-shrink-0 select-none z-20">
      {/* Brand logo header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-charcoal-800/80">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-white block">
              Code Archaeologist
            </span>
            <span className="text-[10px] text-cyan-400/90 font-mono block tracking-wider">
              AST • GRAPH • AI
            </span>
          </div>
        </NavLink>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono font-semibold tracking-widest text-slate-500 uppercase">
          Navigation Matrix
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  'relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group',
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/20 via-indigo-500/10 to-transparent text-white border border-indigo-500/30 shadow-subtle'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-charcoal-850/80 border border-transparent'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-cyan-400 to-indigo-500 shadow-[0_0_12px_rgba(56,189,248,0.8)]" />
                  )}
                  <div className="flex items-center gap-2.5 pl-1">
                    <Icon
                      className={clsx(
                        'w-4 h-4 transition-colors',
                        isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-indigo-400'
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge variant={isActive ? 'cyan' : 'indigo'} size="sm">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Active Repo Telemetry Card */}
      <div className="p-3 border-t border-charcoal-800/80">
        <div className="glass-panel border border-charcoal-750 rounded-xl p-3 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-[11px] text-cyan-400 font-mono">
              <GitBranch className="w-3.5 h-3.5" />
              <span>ACTIVE TARGET</span>
            </div>
            <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SYNCED
            </span>
          </div>
          <p className="text-xs font-semibold text-white truncate font-mono">
            {activeRepoId === 'repo-sample-1' ? 'code-archaeologist-core' : activeRepoId}
          </p>
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-charcoal-800 text-[10px] text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-indigo-400" />
              84 files
            </span>
            <span className="text-indigo-300">420 symbols</span>
          </div>
        </div>
      </div>

      {/* Settings Footer */}
      <div className="p-3 border-t border-charcoal-800/80">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            clsx(
              'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all',
              isActive
                ? 'bg-charcoal-800 text-cyan-300 border border-charcoal-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-charcoal-850'
            )
          }
        >
          <div className="flex items-center gap-2.5">
            <Settings className="w-4 h-4" />
            <span>System Preferences</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        </NavLink>
      </div>
    </aside>
  );
};
