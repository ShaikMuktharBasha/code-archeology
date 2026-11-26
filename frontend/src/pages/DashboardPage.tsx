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
  Sparkles,
  ArrowUpRight,
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

  const langColors: Record<string, string> = {
    Python: 'bg-indigo-500',
    TypeScript: 'bg-cyan-400',
    SQL: 'bg-emerald-400',
    Docker: 'bg-sky-400',
    Shell: 'bg-amber-400',
    CSS: 'bg-violet-400',
    JSON: 'bg-slate-400',
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner & Quick Upload Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-charcoal-800/80">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <Badge variant="cyan" size="sm">
              <Sparkles className="w-3 h-3 mr-1" />
              COMMAND CENTER
            </Badge>
            <span className="text-[11px] font-mono text-slate-500">
              REAL-TIME AST TELEMETRY
            </span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Repository Intelligence Hub
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Monitor indexed codebases, inspect AST symbol topologies, and launch neural retrieval.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/architecture/repo-sample-1">
            <Button variant="secondary" icon={<Network className="w-4 h-4 text-cyan-400" />}>
              Open Primary DAG
            </Button>
          </Link>
          <Link to="/upload">
            <Button variant="primary" icon={<UploadCloud className="w-4 h-4" />}>
              Ingest Repository
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Repositories"
          value={repositories.length}
          subtitle="All AST caches verified"
          icon={Layers}
          trend="100% online & indexed"
          accent="indigo"
        />
        <MetricCard
          title="Files Indexed"
          value={totalFiles}
          subtitle="Safe sandbox extractions"
          icon={FileCode}
          trend="Zero traversal anomalies"
          accent="cyan"
        />
        <MetricCard
          title="AST Symbols"
          value={totalSymbols}
          subtitle="Classes, functions, routes"
          icon={Network}
          trend="DAG topology resolved"
          accent="emerald"
        />
        <MetricCard
          title="Grammars Active"
          value="5+"
          subtitle="Python, TS, JS, Java, Go"
          icon={GitBranch}
          trend="Tree-Sitter + Python AST"
          accent="amber"
        />
      </div>

      {/* Analyzed Repositories Registry */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-cyan-400 to-indigo-500" />
            <span>Indexed Codebases</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {repositories.length} active targets
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {repositories.map((repo) => (
            <Card key={repo.id} hoverable className="flex flex-col justify-between h-full group">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                    <h4 className="font-bold text-sm text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                      {repo.name}
                    </h4>
                  </div>
                  <Badge variant="indigo" size="sm">
                    {repo.source_type}
                  </Badge>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {repo.description || 'No description provided.'}
                </p>

                {/* Mini Language Spectrum Bar */}
                <div className="h-1.5 w-full bg-charcoal-900 rounded-full overflow-hidden flex mb-3">
                  {Object.entries(repo.languages).map(([lang, pct]) => (
                    <div
                      key={lang}
                      style={{ width: `${pct}%` }}
                      className={`h-full ${langColors[lang] || 'bg-indigo-400'}`}
                      title={`${lang}: ${pct}%`}
                    />
                  ))}
                </div>

                {/* Language tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {Object.entries(repo.languages).map(([lang, pct]) => (
                    <span
                      key={lang}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-charcoal-900/90 text-slate-300 border border-charcoal-750"
                    >
                      {lang} <span className="text-slate-500">{pct}%</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Actions */}
              <div className="pt-3.5 border-t border-charcoal-800/90 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span>{repo.file_count} files</span>
                  <span className="text-indigo-300">{repo.symbol_count} sym</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Link
                    to={`/architecture/${repo.id}`}
                    className="px-2 py-1 rounded-lg bg-charcoal-900 hover:bg-indigo-600/20 border border-charcoal-750 hover:border-indigo-500/40 text-cyan-400 text-[11px] font-mono flex items-center gap-1 transition-all"
                    title="Architecture DAG"
                  >
                    <Network className="w-3 h-3" />
                    <span>DAG</span>
                  </Link>
                  <Link
                    to={`/explorer/${repo.id}`}
                    className="p-1.5 rounded-lg bg-charcoal-900 hover:bg-charcoal-800 border border-charcoal-750 text-slate-300 hover:text-white transition-all"
                    title="Explore Files"
                  >
                    <FolderTree className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to={`/assistant/${repo.id}`}
                    className="p-1.5 rounded-lg bg-charcoal-900 hover:bg-charcoal-800 border border-charcoal-750 text-indigo-300 hover:text-white transition-all"
                    title="Ask AI"
                  >
                    <BotMessageSquare className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity Telemetry */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-emerald-400 to-cyan-500" />
            <span>System Telemetry & Activity</span>
          </h3>
          <Link
            to="/impact/repo-sample-1"
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>Inspect Impact Matrix</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <Card className="divide-y divide-charcoal-800/80 p-0 overflow-hidden">
          {[
            {
              event: 'Parsed AST classes & functions for code-archaeologist-core',
              time: '12 minutes ago',
              status: '420 symbols indexed',
              variant: 'cyan' as const,
              icon: Network,
            },
            {
              event: 'Resolved import relationships in src/services/auth.ts',
              time: '34 minutes ago',
              status: 'Blast radius: 68%',
              variant: 'warning' as const,
              icon: Activity,
            },
            {
              event: 'Generated pgvector embeddings for CodeChunkEmbeddingStore',
              time: '1 hour ago',
              status: 'HNSW index synced',
              variant: 'success' as const,
              icon: FileCode,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-4 flex items-center justify-between hover:bg-charcoal-800/40 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-charcoal-900 border border-charcoal-750 flex items-center justify-center text-cyan-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-200">{item.event}</p>
                    <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </p>
                  </div>
                </div>
                <Badge variant={item.variant} size="sm">
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
