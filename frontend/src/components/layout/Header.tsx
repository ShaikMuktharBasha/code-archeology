import React from 'react';
import { Search, Sparkles, Terminal, Bell } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface HeaderProps {
  title?: string;
  activeRepoId?: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="h-16 px-6 bg-charcoal-900/80 backdrop-blur-md border-b border-charcoal-800 flex items-center justify-between flex-shrink-0 z-10">
      <div className="flex items-center gap-4">
        {title && (
          <h1 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
            {title}
          </h1>
        )}
      </div>

      {/* Quick Search & Actions */}
      <div className="flex items-center gap-3">
        {/* Search / Command trigger */}
        <div className="relative">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-charcoal-850 border border-charcoal-750 rounded-lg text-xs text-slate-400 w-64 hover:border-charcoal-600 transition-colors cursor-pointer">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search symbols, files, classes...</span>
            <kbd className="ml-auto font-mono text-[10px] bg-charcoal-750 px-1.5 py-0.5 rounded border border-charcoal-600 text-slate-400">
              Ctrl+K
            </kbd>
          </div>
        </div>

        {/* Gemini Engine Status */}
        <Badge variant="indigo" size="sm" className="hidden sm:inline-flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>Gemini Intelligence Ready</span>
        </Badge>

        <Button
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-white p-2"
          title="Terminal Logs"
        >
          <Terminal className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-white p-2"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
};
