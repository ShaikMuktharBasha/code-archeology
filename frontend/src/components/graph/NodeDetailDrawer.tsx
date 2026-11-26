import React, { useState } from 'react';
import {
  X,
  Activity,
  FolderTree,
  Layers,
  ShieldAlert,
  GitFork,
  Check,
  Copy,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Edge } from '@xyflow/react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { GraphNodeData } from '../../types';

interface NodeDetailDrawerProps {
  node: any;
  allNodes?: any[];
  allEdges?: Edge[];
  onClose: () => void;
  repoId: string;
}

export const NodeDetailDrawer: React.FC<NodeDetailDrawerProps> = ({
  node,
  allNodes = [],
  allEdges = [],
  onClose,
  repoId,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'symbols' | 'deps' | 'code'>('overview');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!node) return null;

  const data = (node.data || {}) as GraphNodeData;

  const outgoingEdges = allEdges.filter((e) => e.source === node.id);
  const incomingEdges = allEdges.filter((e) => e.target === node.id);

  const getNodeLabel = (id: string) => {
    const found = allNodes.find((n) => n.id === id);
    return found ? (found.data as GraphNodeData).label : id;
  };

  const handleCopyCode = () => {
    if (data.codeSnippet) {
      navigator.clipboard.writeText(data.codeSnippet);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="w-96 h-full glass-panel border-l border-charcoal-750 flex flex-col z-20 shadow-panel">
      {/* Drawer Header */}
      <div className="p-4 border-b border-charcoal-750 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
            Architecture Inspector
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-charcoal-750 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Target Title Box */}
      <div className="p-4 bg-charcoal-900/60 border-b border-charcoal-750 flex-shrink-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <Badge variant="indigo" size="sm">
            {data.kind || 'Component'}
          </Badge>
          <Badge variant="outline" size="sm">
            Layer: {data.layer || 'domain'}
          </Badge>
          {data.complexity && (
            <Badge
              variant={
                data.complexity === 'High'
                  ? 'error'
                  : data.complexity === 'Medium'
                  ? 'warning'
                  : 'success'
              }
              size="sm"
            >
              Cpx: {data.complexity}
            </Badge>
          )}
        </div>
        <h3 className="text-base font-bold text-white tracking-tight">{data.label}</h3>
        <p className="text-xs text-cyan-300/90 font-mono mt-1 break-all bg-charcoal-950 p-2 rounded-lg border border-charcoal-750">
          {data.path}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-charcoal-750 bg-charcoal-900/40 text-xs font-mono flex-shrink-0">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'symbols', label: `AST (${data.methods?.length || data.symbolsCount || 0})` },
          { key: 'deps', label: `Deps (${outgoingEdges.length + incomingEdges.length})` },
          { key: 'code', label: 'Snippet' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 font-medium ${
              activeTab === tab.key
                ? 'border-cyan-400 text-cyan-300 bg-charcoal-850'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {data.description && (
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Architecture Description
                </span>
                <p className="text-xs text-slate-300 leading-relaxed bg-charcoal-900 p-3 rounded-xl border border-charcoal-750">
                  {data.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-charcoal-900 border border-charcoal-750">
                <span className="text-slate-400 block text-[10px]">Language</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">{data.language}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-charcoal-900 border border-charcoal-750">
                <span className="text-slate-400 block text-[10px]">Lines of Code</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">{data.loc || 0} LOC</span>
              </div>
              <div className="p-2.5 rounded-xl bg-charcoal-900 border border-charcoal-750">
                <span className="text-slate-400 block text-[10px]">Blast Radius Risk</span>
                <span
                  className={`font-semibold mt-0.5 block ${
                    data.blastRadius === 'Critical'
                      ? 'text-rose-400'
                      : data.blastRadius === 'Caution'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {data.blastRadius || 'Minimal'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-charcoal-900 border border-charcoal-750">
                <span className="text-slate-400 block text-[10px]">Extracted Symbols</span>
                <span className="font-semibold text-indigo-300 mt-0.5 block">
                  {data.symbolsCount || 0} symbols
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 pt-2 border-t border-charcoal-750">
              <Link to={`/impact/${repoId}`} className="block">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-start text-xs"
                  icon={<Activity className="w-3.5 h-3.5 text-amber-400" />}
                >
                  Run Blast Radius Analysis
                </Button>
              </Link>
              <Link to={`/explorer/${repoId}`} className="block">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  icon={<FolderTree className="w-3.5 h-3.5 text-slate-300" />}
                >
                  View in Source Explorer
                </Button>
              </Link>
              <Link to={`/assistant/${repoId}`} className="block">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs text-cyan-300 hover:text-white"
                  icon={<Sparkles className="w-3.5 h-3.5 text-cyan-400" />}
                >
                  Ask Gemini About This Component
                </Button>
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'symbols' && (
          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-slate-300 tracking-wider uppercase block">
              Extracted AST Methods & Signatures
            </span>
            {data.methods && data.methods.length > 0 ? (
              data.methods.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-charcoal-900 border border-charcoal-750 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold text-cyan-300">{m.name}()</span>
                    <span className="text-[10px] text-slate-400">
                      L{m.startLine}–{m.endLine}
                    </span>
                  </div>
                  <pre className="text-[11px] font-mono text-slate-300 bg-charcoal-950 p-2 rounded-lg overflow-x-auto">
                    {m.signature}
                  </pre>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-charcoal-800 text-slate-300 border border-charcoal-700">
                      {m.visibility}
                    </span>
                    {m.isAsync && (
                      <span className="px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                        async
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs font-mono text-slate-400 p-4 text-center">
                No individual methods extracted for this node.
              </div>
            )}
          </div>
        )}

        {activeTab === 'deps' && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-white tracking-tight flex items-center gap-1.5 mb-2">
                <GitFork className="w-3.5 h-3.5 text-cyan-400" />
                <span>Outgoing Dependencies ({outgoingEdges.length})</span>
              </span>
              <div className="space-y-1.5 font-mono text-xs">
                {outgoingEdges.length > 0 ? (
                  outgoingEdges.map((edge) => (
                    <div
                      key={edge.id}
                      className="p-2.5 rounded-xl bg-charcoal-900 border border-charcoal-750 flex items-center justify-between text-slate-300"
                    >
                      <span className="truncate pr-2">{getNodeLabel(edge.target)}</span>
                      <Badge variant="cyan" size="sm">
                        {String(edge.data?.relationType || 'imports')}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] font-mono text-slate-500">No outgoing internal imports.</p>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-charcoal-750">
              <span className="text-xs font-semibold text-white tracking-tight flex items-center gap-1.5 mb-2">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Incoming Callers ({incomingEdges.length})</span>
              </span>
              <div className="space-y-1.5 font-mono text-xs">
                {incomingEdges.length > 0 ? (
                  incomingEdges.map((edge) => (
                    <div
                      key={edge.id}
                      className="p-2.5 rounded-xl bg-charcoal-900 border border-charcoal-750 flex items-center justify-between text-slate-300"
                    >
                      <span className="truncate pr-2">{getNodeLabel(edge.source)}</span>
                      <Badge variant="warning" size="sm">
                        depends on
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] font-mono text-slate-500">No inbound internal callers detected.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 font-mono">
                Source Code Preview
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded hover:bg-charcoal-750"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-charcoal-950 border border-charcoal-750 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
              {data.codeSnippet || `// ${data.path}\n// AST verified component`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
