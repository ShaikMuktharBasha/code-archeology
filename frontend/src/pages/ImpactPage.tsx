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
    api.getSymbols(id).then(setSymbols);
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
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="warning" size="sm">
            Blast Radius Analyzer
          </Badge>
          <span className="text-xs text-slate-400 font-mono">Downstream Risk Traversal</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Impact & Dependency Analysis</h2>
        <p className="text-sm text-slate-400 mt-1">
          Select any function, class, or module to discover direct dependencies, reverse caller trees,
          and potentially affected files before introducing changes.
        </p>
      </div>

      {/* Target Selector */}
      <Card className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1">
            Target Symbol for Impact Assessment
          </label>
          <select
            value={selectedSymbolId}
            onChange={(e) => setSelectedSymbolId(e.target.value)}
            className="bg-charcoal-900 border border-charcoal-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500 w-72"
          >
            {symbols.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.symbol_type}) - {s.file_path}
              </option>
            ))}
          </select>
        </div>

        {impactData && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-mono">Blast Radius Score</span>
              <span className="text-2xl font-bold font-mono text-amber-400">
                {impactData.blast_radius_score}%
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-mono">Affected Files</span>
              <span className="text-2xl font-bold font-mono text-white">
                {impactData.affected_files_count}
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Impact Summary Alert */}
      {impactData && (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-900/60 flex items-start gap-3 text-xs leading-relaxed text-amber-200">
          <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-300 block mb-1">Architectural Advisory</span>
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
              <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span>Direct Dependencies (Outgoing)</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {impactData.direct_dependencies.length} items
              </span>
            </div>

            <div className="space-y-2">
              {impactData.direct_dependencies.map((dep) => (
                <Card key={dep.id} className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-semibold text-white">{dep.name}</span>
                    <Badge variant="default" size="sm">
                      {dep.type}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mb-1">{dep.path}</p>
                  <p className="text-xs text-slate-300 leading-snug">{dep.reason}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Reverse Dependencies (Who depends on this) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Reverse Dependencies (Downstream Callers)</span>
              </h3>
              <Badge variant="warning" size="sm">
                Critical Callers
              </Badge>
            </div>

            <div className="space-y-2">
              {impactData.reverse_dependencies.map((rev) => (
                <Card key={rev.id} className="p-3 border-charcoal-700 hover:border-amber-900/60">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-semibold text-white">{rev.name}</span>
                    <Badge
                      variant={rev.impact_level === 'high' ? 'error' : 'warning'}
                      size="sm"
                    >
                      {rev.impact_level} risk
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mb-1">{rev.path}</p>
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
