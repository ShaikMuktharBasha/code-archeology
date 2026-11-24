import React from 'react';
import { X, Activity, FolderTree, Code2, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface NodeDetailDrawerProps {
  node: any;
  onClose: () => void;
  repoId: string;
}

export const NodeDetailDrawer: React.FC<NodeDetailDrawerProps> = ({ node, onClose, repoId }) => {
  if (!node) return null;

  const data = node.data || {};

  return (
    <div className="w-80 h-full bg-charcoal-850 border-l border-charcoal-750 flex flex-col z-20 shadow-panel">
      {/* Drawer Header */}
      <div className="p-4 border-b border-charcoal-750 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Node Inspector
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-charcoal-750 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-5">
        <div>
          <Badge variant="indigo" size="sm" className="mb-1.5">
            {data.kind || 'Component'}
          </Badge>
          <h3 className="text-base font-bold text-white tracking-tight">{data.label}</h3>
          <p className="text-xs text-slate-400 font-mono mt-1 break-all bg-charcoal-900 p-2 rounded border border-charcoal-750">
            {data.path}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-charcoal-800 border border-charcoal-750">
            <span className="text-slate-400 block text-[11px]">Language</span>
            <span className="font-semibold text-slate-200 mt-0.5 block">{data.language}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-charcoal-800 border border-charcoal-750">
            <span className="text-slate-400 block text-[11px]">Symbols</span>
            <span className="font-semibold text-slate-200 mt-0.5 block">
              {data.symbolsCount || 8} extracted
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
              Analyze Blast Radius
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
        </div>

        {/* Extracted Symbols in this Node */}
        <div className="space-y-2 pt-2 border-t border-charcoal-750">
          <span className="text-xs font-semibold text-slate-300 tracking-wider uppercase block">
            Extracted Methods & Classes
          </span>
          <div className="space-y-1.5 font-mono text-xs">
            {['validateToken', 'isTokenRevoked', 'generateSignature', 'refreshSession'].map((m) => (
              <div
                key={m}
                className="p-2 rounded bg-charcoal-900 border border-charcoal-750 flex items-center justify-between text-slate-300"
              >
                <div className="flex items-center gap-1.5">
                  <Code2 className="w-3 h-3 text-indigo-400" />
                  <span>{m}()</span>
                </div>
                <span className="text-[10px] text-slate-400">pub async</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
