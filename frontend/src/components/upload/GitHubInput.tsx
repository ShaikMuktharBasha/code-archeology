import React, { useState } from 'react';
import { GitBranch, Globe, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';

interface GitHubInputProps {
  onSubmit: (url: string, branch: string) => void;
  isLoading?: boolean;
}

export const GitHubInput: React.FC<GitHubInputProps> = ({ onSubmit, isLoading }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = repoUrl.trim();
    if (!trimmed) {
      setError('Please provide a GitHub repository URL');
      return;
    }
    if (!trimmed.includes('github.com')) {
      setError('URL must point to a valid GitHub repository (e.g. https://github.com/owner/repo)');
      return;
    }

    onSubmit(trimmed, branch.trim() || 'main');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
          Repository URL
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Globe className="w-4 h-4" />
          </div>
          <input
            type="url"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/organization/repository"
            disabled={isLoading}
            className="w-full pl-10 pr-4 py-2.5 bg-charcoal-850 border border-charcoal-700 rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
            Branch
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <GitBranch className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="main"
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-2.5 bg-charcoal-850 border border-charcoal-700 rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
            />
          </div>
        </div>

        <div className="flex items-end">
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading || !repoUrl}
            className="w-full py-2.5"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            {isLoading ? 'Connecting Repository...' : 'Connect & Analyze'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/40 border border-rose-900/60 px-3.5 py-2 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </form>
  );
};
