import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import {
  Box,
  Layers,
  Code2,
  Database,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { GraphNodeData, MethodItem } from '../../types';

// Multi-handle node wrapper supporting Top, Bottom, Left, and Right connection points
const NodeHandles = ({ color = '#6366f1' }: { color?: string }) => (
  <>
    <Handle
      id="top"
      type="target"
      position={Position.Top}
      style={{ background: color, width: 8, height: 8 }}
    />
    <Handle
      id="bottom"
      type="source"
      position={Position.Bottom}
      style={{ background: color, width: 8, height: 8 }}
    />
    <Handle
      id="left"
      type="target"
      position={Position.Left}
      style={{ background: color, width: 8, height: 8 }}
    />
    <Handle
      id="right"
      type="source"
      position={Position.Right}
      style={{ background: color, width: 8, height: 8 }}
    />
  </>
);

// Helper for Complexity Badge
const ComplexityBadge = ({ complexity }: { complexity?: 'Low' | 'Medium' | 'High' }) => {
  if (!complexity) return null;
  const colors = {
    Low: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
    Medium: 'text-amber-400 bg-amber-950/60 border-amber-800/60',
    High: 'text-rose-400 bg-rose-950/60 border-rose-800/60',
  };
  return (
    <span
      className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${colors[complexity]}`}
      title={`Cyclomatic Complexity: ${complexity}`}
    >
      Cpx: {complexity}
    </span>
  );
};

// Expandable methods accordion inside nodes
const MethodsAccordion = ({ methods }: { methods?: MethodItem[] }) => {
  const [expanded, setExpanded] = useState(false);
  if (!methods || methods.length === 0) return null;

  return (
    <div className="mt-2.5 pt-2 border-t border-charcoal-750/80">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setExpanded((prev) => !prev);
        }}
        className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400 hover:text-slate-200 transition-colors py-0.5"
      >
        <span className="flex items-center gap-1">
          <Code2 className="w-3 h-3 text-indigo-400" />
          <span>{methods.length} AST Methods</span>
        </span>
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {expanded && (
        <div className="mt-1.5 space-y-1 max-h-36 overflow-y-auto pr-1">
          {methods.map((m, idx) => (
            <div
              key={idx}
              className="p-1.5 rounded bg-charcoal-900 border border-charcoal-750 font-mono text-[10px] text-slate-300 flex items-center justify-between"
            >
              <div className="truncate pr-1">
                <span className="text-indigo-400 font-semibold">{m.name}</span>
                <span className="text-slate-500 text-[9px] block truncate">{m.signature}</span>
              </div>
              <span className="text-slate-500 flex-shrink-0">L{m.startLine}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ModuleNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as GraphNodeData;
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(nodeData.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`px-4 py-3.5 rounded-2xl border transition-all min-w-[250px] max-w-[290px] glass-panel shadow-panel ${
        selected
          ? 'border-cyan-400 ring-2 ring-cyan-400/40 shadow-glow-cyan'
          : 'border-charcoal-700/90 hover:border-indigo-500/50'
      }`}
    >
      <NodeHandles color="#6366f1" />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-mono font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>module</span>
        </div>
        <div className="flex items-center gap-1">
          <ComplexityBadge complexity={nodeData.complexity} />
          <Badge variant="indigo" size="sm">
            {nodeData.badge || 'Core'}
          </Badge>
        </div>
      </div>

      {/* Title & Path */}
      <div className="text-sm font-semibold text-white tracking-tight leading-snug">
        {nodeData.label}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-1 bg-charcoal-900/80 px-2 py-1 rounded border border-charcoal-750">
        <span className="truncate pr-1">{nodeData.path}</span>
        <button
          onClick={handleCopy}
          className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
          title="Copy file path"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>

      {/* Stats */}
      <div className="mt-2.5 pt-2 border-t border-charcoal-750 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>{nodeData.language}</span>
        <span className="text-indigo-300">{nodeData.symbolsCount || 0} symbols</span>
        {nodeData.loc && <span>{nodeData.loc} LOC</span>}
      </div>

      {/* Expandable Methods */}
      <MethodsAccordion methods={nodeData.methods} />
    </div>
  );
});

export const ServiceNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as GraphNodeData;
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(nodeData.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`px-4 py-3.5 rounded-2xl border transition-all min-w-[250px] max-w-[290px] glass-panel shadow-panel ${
        selected
          ? 'border-indigo-400 ring-2 ring-indigo-500/50 shadow-glow'
          : 'border-indigo-900/60 hover:border-indigo-500/60'
      }`}
    >
      <NodeHandles color="#818cf8" />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-mono font-semibold">
          <Box className="w-3.5 h-3.5" />
          <span>class / service</span>
        </div>
        <div className="flex items-center gap-1">
          <ComplexityBadge complexity={nodeData.complexity} />
          {nodeData.blastRadius === 'Critical' && (
            <span
              className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"
              title="Critical Blast Radius"
            />
          )}
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </div>
      </div>

      {/* Title & Path */}
      <div className="text-sm font-semibold text-white tracking-tight leading-snug">
        {nodeData.label}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-1 bg-charcoal-900/80 px-2 py-1 rounded border border-charcoal-750">
        <span className="truncate pr-1">{nodeData.path}</span>
        <button
          onClick={handleCopy}
          className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
          title="Copy file path"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>

      {/* Stats */}
      <div className="mt-2.5 pt-2 border-t border-charcoal-750 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>{nodeData.language}</span>
        <span className="text-indigo-300">{nodeData.symbolsCount || 0} methods</span>
        {nodeData.loc && <span>{nodeData.loc} LOC</span>}
      </div>

      {/* Expandable Methods */}
      <MethodsAccordion methods={nodeData.methods} />
    </div>
  );
});

export const FunctionNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as GraphNodeData;
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(nodeData.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`px-4 py-3.5 rounded-2xl border transition-all min-w-[250px] max-w-[290px] glass-panel shadow-panel ${
        selected
          ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-glow'
          : 'border-charcoal-700/90 hover:border-amber-500/50'
      }`}
    >
      <NodeHandles color="#f59e0b" />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono font-semibold">
          <Code2 className="w-3.5 h-3.5" />
          <span>function</span>
        </div>
        <ComplexityBadge complexity={nodeData.complexity} />
      </div>

      {/* Title & Path */}
      <div className="text-sm font-semibold text-white tracking-tight leading-snug">
        {nodeData.label}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-1 bg-charcoal-900/80 px-2 py-1 rounded border border-charcoal-750">
        <span className="truncate pr-1">{nodeData.path}</span>
        <button
          onClick={handleCopy}
          className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
          title="Copy file path"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>

      {/* Stats */}
      <div className="mt-2.5 pt-2 border-t border-charcoal-750 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>{nodeData.language}</span>
        <span className="text-amber-400">AST Resolved</span>
        {nodeData.loc && <span>{nodeData.loc} LOC</span>}
      </div>

      {/* Expandable Methods */}
      <MethodsAccordion methods={nodeData.methods} />
    </div>
  );
});

export const DatabaseNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as GraphNodeData;
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(nodeData.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`px-4 py-3.5 rounded-2xl border transition-all min-w-[250px] max-w-[290px] glass-panel shadow-panel ${
        selected
          ? 'border-emerald-400 ring-2 ring-emerald-400/40 shadow-glow'
          : 'border-emerald-900/60 hover:border-emerald-500/60'
      }`}
    >
      <NodeHandles color="#10b981" />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-semibold">
          <Database className="w-3.5 h-3.5" />
          <span>storage</span>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
      </div>

      {/* Title & Path */}
      <div className="text-sm font-semibold text-white tracking-tight leading-snug">
        {nodeData.label}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-1 bg-charcoal-900/80 px-2 py-1 rounded border border-charcoal-750">
        <span className="truncate pr-1">{nodeData.path}</span>
        <button
          onClick={handleCopy}
          className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
          title="Copy file path"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>

      {/* Stats */}
      <div className="mt-2.5 pt-2 border-t border-charcoal-750 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>{nodeData.language}</span>
        <span className="text-emerald-400">{nodeData.badge || 'Vector DB'}</span>
        {nodeData.loc && <span>{nodeData.loc} LOC</span>}
      </div>

      {/* Expandable Methods */}
      <MethodsAccordion methods={nodeData.methods} />
    </div>
  );
});
