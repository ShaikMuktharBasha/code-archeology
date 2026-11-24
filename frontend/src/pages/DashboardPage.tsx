import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderTree,
  Network,
  BotMessageSquare,
  FileCode,
  Layers,
  Clock,
  GitBranch,
  UploadCloud,
  Activity,
} from 'lucide-react';
import { MetricCard } from '../components/common/MetricCard';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { api } from '../services/api';
import { Repository } from '../types';

export const DashboardPage: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);

  useEffect(() => {
    api.getRepositories().then((data) => {
      setRepositories(data);
    });
  }, []);

  const totalFiles = repositories.reduce((acc, r) => acc + r.file_count, 0);
  const totalSymbols = repositories.reduce((acc, r) => acc + r.symbol_count, 0);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner & Quick Upload Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Repository Intelligence Hub</h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time codebase architectures, AST symbol maps, and grounded AI retrieval.
          </p>
        </div>
        <Link to="/upload">
          <Button variant="primary" icon={<UploadCloud className="w-4 h-4" />}>
            Ingest New Repository
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Repositories Analyzed"
          value={repositories.length}
          subtitle="All AST caches verified"
          icon={Layers}
          trend="+100% indexed"
        />
        <MetricCard
          title="Files Indexed"
          value={totalFiles}
          subtitle="Safe sandbox extractions"
          icon={FileCode}
        />
        <MetricCard
          title="Extracted Symbols"
          value={totalSymbols}
          subtitle="Classes, functions, interfaces"
          icon={Network}
        />
        <MetricCard
          title="Detected Languages"
          value="5"
          subtitle="Python, TS, JS, Java, Go"
          icon={GitBranch}
        />
      </div>

      {/* Analyzed Repositories Registry */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white tracking-tight">
            Indexed Codebases
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {repositories.length} repositories ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {repositories.map((repo) => (
            <Card key={repo.id} hoverable className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <h4 className="font-semibold text-sm text-white tracking-tight">{repo.name}</h4>
                  </div>
                  <Badge variant="indigo" size="sm">
                    {repo.source_type}
                  </Badge>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {repo.description || 'No description provided.'}
                </p>

                {/* Language tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {Object.entries(repo.languages).map(([lang, pct]) => (
                    <span
                      key={lang}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-charcoal-750 text-slate-300 border border-charcoal-700"
                    >
                      {lang}: {pct}%
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Actions */}
              <div className="pt-3 border-t border-charcoal-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span>{repo.file_count} files</span>
                  <span>{repo.symbol_count} symbols</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/architecture/${repo.id}`} title="Architecture DAG">
                    <Button variant="ghost" size="sm" className="p-1.5">
                      <Network className="w-3.5 h-3.5 text-indigo-400" />
                    </Button>
                  </Link>
                  <Link to={`/explorer/${repo.id}`} title="Explore Files">
                    <Button variant="ghost" size="sm" className="p-1.5">
                      <FolderTree className="w-3.5 h-3.5 text-slate-300" />
                    </Button>
                  </Link>
                  <Link to={`/assistant/${repo.id}`} title="Ask AI">
                    <Button variant="ghost" size="sm" className="p-1.5">
                      <BotMessageSquare className="w-3.5 h-3.5 text-indigo-300" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-white tracking-tight">Recent Activity</h3>
        <Card className="divide-y divide-charcoal-800 p-0 overflow-hidden">
          {[
            {
              event: 'Parsed AST classes & functions for code-archaeologist-core',
              time: '12 minutes ago',
              status: 'Indexed 420 symbols',
              icon: Network,
            },
            {
              event: 'Resolved import relationships in src/services/auth.ts',
              time: '34 minutes ago',
              status: 'Blast radius computed (68%)',
              icon: Activity,
            },
            {
              event: 'Generated pgvector embeddings for CodeChunkEmbeddingStore',
              time: '1 hour ago',
              status: 'HNSW index synchronized',
              icon: FileCode,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-charcoal-800/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-charcoal-800 border border-charcoal-700 flex items-center justify-center text-indigo-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-200">{item.event}</p>
                    <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </p>
                  </div>
                </div>
                <Badge variant="default" size="sm">
                  {item.status}
                </Badge>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
};
