import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Sparkles,
  Terminal,
  LayoutDashboard,
  Network,
  FolderTree,
  BotMessageSquare,
  Activity,
  UploadCloud,
  Settings,
  X,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface HeaderProps {
  title?: string;
  activeRepoId?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, activeRepoId = 'repo-sample-1' }) => {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setCmdOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const commands = [
    { label: 'Go to Command Center (Dashboard)', path: '/dashboard', icon: LayoutDashboard, tag: 'View' },
    { label: 'Open Architecture DAG Graph', path: `/architecture/${activeRepoId}`, icon: Network, tag: 'Graph' },
    { label: 'Browse Repository Source Explorer', path: `/explorer/${activeRepoId}`, icon: FolderTree, tag: 'Code' },
    { label: 'Ask Gemini Neural Code Assistant', path: `/assistant/${activeRepoId}`, icon: BotMessageSquare, tag: 'AI' },
    { label: 'Run Blast Radius Impact Analysis', path: `/impact/${activeRepoId}`, icon: Activity, tag: 'Risk' },
    { label: 'Ingest New Repository (ZIP / GitHub)', path: '/upload', icon: UploadCloud, tag: 'Ingest' },
    { label: 'System Preferences & API Keys', path: '/settings', icon: Settings, tag: 'Config' },
  ].filter((c) => c.label.toLowerCase().includes(cmdQuery.toLowerCase()));

  const runCommand = (path: string) => {
    setCmdOpen(false);
    setCmdQuery('');
    navigate(path);
  };

  return (
    <>
      <header className="h-16 px-6 bg-charcoal-950/75 backdrop-blur-xl border-b border-charcoal-800/80 flex items-center justify-between flex-shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            <span className="text-slate-500">WORKSPACE //</span>
            <span className="text-slate-200 font-semibold">{title || activeRepoId}</span>
          </div>
        </div>

        {/* Quick Search & Actions */}
        <div className="flex items-center gap-3">
          {/* Command Palette Trigger */}
          <button
            onClick={() => setCmdOpen(true)}
            className="flex items-center gap-2.5 px-3.5 py-1.5 bg-charcoal-900/90 border border-charcoal-750 rounded-xl text-xs text-slate-400 w-64 hover:border-indigo-500/40 hover:text-slate-200 transition-all cursor-pointer shadow-subtle"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span className="truncate">Quick jump or search...</span>
            <kbd className="ml-auto font-mono text-[10px] bg-charcoal-800 px-1.5 py-0.5 rounded border border-charcoal-700 text-slate-400">
              Ctrl+K
            </kbd>
          </button>

          {/* Gemini Engine Status */}
          <Badge variant="cyan" size="sm" className="hidden sm:inline-flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Gemini Engine Online</span>
          </Badge>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/assistant/${activeRepoId}`)}
            className="text-slate-400 hover:text-cyan-300 p-2"
            title="Open AI Terminal"
          >
            <Terminal className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Raycast-style Command Palette Modal */}
      {cmdOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          onClick={() => setCmdOpen(false)}
        >
          <div
            className="w-full max-w-lg glass-panel border border-indigo-500/40 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center px-4 py-3 border-b border-charcoal-750 gap-3">
              <Search className="w-4 h-4 text-cyan-400" />
              <input
                autoFocus
                type="text"
                value={cmdQuery}
                onChange={(e) => setCmdQuery(e.target.value)}
                placeholder="Type a command or destination..."
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
              />
              <button
                onClick={() => setCmdOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 max-h-80 overflow-y-auto space-y-1">
              {commands.map((cmd) => {
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.path}
                    onClick={() => runCommand(cmd.path)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-indigo-600/20 border border-transparent hover:border-indigo-500/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-indigo-400 group-hover:text-cyan-400" />
                      <span className="font-medium">{cmd.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" size="sm">
                        {cmd.tag}
                      </Badge>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                    </div>
                  </button>
                );
              })}
              {commands.length === 0 && (
                <div className="py-6 text-center text-xs font-mono text-slate-500">
                  No matching commands found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
