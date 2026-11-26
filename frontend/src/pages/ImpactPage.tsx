import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  AlertTriangle,
  Code2,
  ShieldAlert,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { api } from '../services/api';
import { ImpactAnalysis, SymbolItem } from '../types';

export const ImpactPage: React.FC = () => {
  const { id = 'repo-sample-1' } = useParams<{ id: string }>();
  const [symbols, setSymbols] = useState<SymbolItem[]>([]);
  const [selectedSymbolId, setSelectedSymbolId] = useState<string>('sym-2');
  const [impactData, setImpactData] = useState<ImpactAnalysis | null>(null);

  useEffect(() => {
    api.getSymbols(id).then((syms) => {
      setSymbols(syms);
      if (syms.length > 0) {
        setSelectedSymbolId(syms[0].id);
      }
    });
  }, [id]);

  useEffect(() => {
    if (selectedSymbolId) {
      api.getImpactAnalysis(id, selectedSymbolId).then(setImpactData);
    }
  }, [id, selectedSymbolId]);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5 mb-2">
          <Badge variant="warning" size="sm">
            BLAST RADIUS SIMULATOR
          </Badge>
          <span className="text-xs text-slate-400 font-mono">Downstream Risk Traversal</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          Impact & Dependency Analysis
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Select any function, class, or module to trace direct dependencies, reverse caller trees,
          and downstream blast radius before modifying code.
        </p>
      </div>

      {/* Target Selector & Telemetry Gauge */}
      <Card glow className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="w-full md:w-auto">
          <label className="text-[11px] font-mono font-semibold text-cyan-400 uppercase tracking-wider block mb-2">
            Target Symbol for Impact Assessment
          </label>
          <select
            value={selectedSymbolId}
            onChange={(e) => setSelectedSymbolId(e.target.value)}
            className="bg-charcoal-950 border border-charcoal-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-400 w-full md:w-80"
          >
            {symbols.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.symbol_type}) - {s.file_path}
              </option>
            ))}
          </select>
        </div>

        {impactData && (
          <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
            <div className="min-w-[160px]">
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">Blast Radius</span>
                <span className="font-bold text-amber-400">{impactData.blast_radius_score}%</span>
              </div>
              <div className="h-2 w-full bg-charcoal-900 rounded-full overflow-hidden border border-charcoal-750">
                <div
                  style={{ width: `${impactData.blast_radius_score}%` }}
                  className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.7)]"
                />
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-mono uppercase">Affected Files</span>
              <span className="text-3xl font-extrabold font-mono text-white">
                {impactData.affected_files_count}
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Impact Summary Alert */}
      {impactData && (
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3.5 text-xs leading-relaxed text-amber-100 shadow-[0_0_25px_-8px_rgba(245,158,11,0.3)]">
          <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300 block mb-1 font-mono uppercase tracking-wider text-[11px]">
              Architectural Advisory
            </span>
            {impactData.summary}
          </div>
        </div>
      )}

      {/* Dependency Columns */}
      {impactData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Direct Dependencies */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>Direct Dependencies (Outgoing)</span>
              </h3>
              <Badge variant="cyan" size="sm">
                {impactData.direct_dependencies.length} items
              </Badge>
            </div>

            <div className="space-y-2.5">
              {impactData.direct_dependencies.map((dep) => (
                <Card key={dep.id} className="p-4 hover:border-cyan-500/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-white">{dep.name}</span>
                    <Badge variant="indigo" size="sm">
                      {dep.type}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-cyan-300/90 font-mono mb-1.5">{dep.path}</p>
                  <p className="text-xs text-slate-300 leading-snug">{dep.reason}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Reverse Dependencies (Who depends on this) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Reverse Dependencies (Downstream Callers)</span>
              </h3>
              <Badge variant="warning" size="sm">
                Critical Callers
              </Badge>
            </div>

            <div className="space-y-2.5">
              {impactData.reverse_dependencies.map((rev) => (
                <Card key={rev.id} className="p-4 border-charcoal-700 hover:border-amber-500/40">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-white">{rev.name}</span>
                    <Badge
                      variant={rev.impact_level === 'high' ? 'error' : 'warning'}
                      size="sm"
                    >
                      {rev.impact_level} risk
                    </Badge>
                  </div>
                  <p className="text-[11px] text-amber-300/90 font-mono mb-1.5">{rev.path}</p>
                  <p className="text-xs text-slate-300 leading-snug">{rev.reason}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
