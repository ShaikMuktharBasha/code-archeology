import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Box, Layers, Code2, Database } from 'lucide-react';
import { Badge } from '../common/Badge';

export const ModuleNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div
      className={`px-4 py-3 rounded-xl border transition-all min-w-[220px] bg-charcoal-850 shadow-subtle ${
        selected
          ? 'border-indigo-500 ring-2 ring-indigo-500/40 bg-charcoal-800'
          : 'border-charcoal-700 hover:border-charcoal-600'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-indigo-500 !w-2.5 !h-2.5" />
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-mono">
          <Layers className="w-3.5 h-3.5" />
          <span>module</span>
        </div>
        <Badge variant="indigo" size="sm">
          {String(data.badge || 'Core')}
        </Badge>
      </div>

      <div className="text-sm font-semibold text-white tracking-tight">{String(data.label)}</div>
      <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">{String(data.path)}</div>

      <div className="mt-2.5 pt-2 border-t border-charcoal-750 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>{String(data.language)}</span>
        <span>{String(data.symbolsCount || 0)} symbols</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-indigo-500 !w-2.5 !h-2.5" />
    </div>
  );
});

export const ServiceNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div
      className={`px-4 py-3 rounded-xl border transition-all min-w-[220px] bg-charcoal-850 shadow-subtle ${
        selected
          ? 'border-indigo-400 ring-2 ring-indigo-500/40 bg-charcoal-800'
          : 'border-indigo-900/60 hover:border-indigo-700/80'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-indigo-400 !w-2.5 !h-2.5" />
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-mono">
          <Box className="w-3.5 h-3.5" />
          <span>class / service</span>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>

      <div className="text-sm font-semibold text-white tracking-tight">{String(data.label)}</div>
      <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">{String(data.path)}</div>

      <div className="mt-2.5 pt-2 border-t border-charcoal-750 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>{String(data.language)}</span>
        <span className="text-indigo-300">{String(data.symbolsCount || 0)} methods</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-indigo-400 !w-2.5 !h-2.5" />
    </div>
  );
});

export const FunctionNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div
      className={`px-4 py-3 rounded-xl border transition-all min-w-[200px] bg-charcoal-850 shadow-subtle ${
        selected
          ? 'border-amber-500 ring-2 ring-amber-500/40 bg-charcoal-800'
          : 'border-charcoal-700 hover:border-charcoal-600'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-amber-400 !w-2.5 !h-2.5" />
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono">
          <Code2 className="w-3.5 h-3.5" />
          <span>function</span>
        </div>
      </div>

      <div className="text-sm font-semibold text-white tracking-tight">{String(data.label)}</div>
      <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">{String(data.path)}</div>

      <div className="mt-2.5 pt-2 border-t border-charcoal-750 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>{String(data.language)}</span>
        <span>AST Resolved</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-amber-400 !w-2.5 !h-2.5" />
    </div>
  );
});

export const DatabaseNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div
      className={`px-4 py-3 rounded-xl border transition-all min-w-[210px] bg-charcoal-850 shadow-subtle ${
        selected
          ? 'border-emerald-500 ring-2 ring-emerald-500/40 bg-charcoal-800'
          : 'border-emerald-900/60 hover:border-emerald-700'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-emerald-400 !w-2.5 !h-2.5" />
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
          <Database className="w-3.5 h-3.5" />
          <span>storage</span>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
      </div>

      <div className="text-sm font-semibold text-white tracking-tight">{String(data.label)}</div>
      <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">{String(data.path)}</div>

      <div className="mt-2.5 pt-2 border-t border-charcoal-750 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>{String(data.language)}</span>
        <span className="text-emerald-400">{String(data.badge || 'Vector DB')}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-emerald-400 !w-2.5 !h-2.5" />
    </div>
  );
});
