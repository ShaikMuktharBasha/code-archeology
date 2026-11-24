import React from 'react';
import { CheckCircle2, Loader2, Sparkles, Network, FileCode } from 'lucide-react';

interface IngestionProgressProps {
  currentStep: number;
}

export const IngestionProgress: React.FC<IngestionProgressProps> = ({ currentStep }) => {
  const steps = [
    { label: 'Unpack & Security Scan', icon: FileCode, desc: 'Zip slip & directory verification' },
    { label: 'AST & Symbol Parsing', icon: Network, desc: 'Classes, functions, and import resolution' },
    { label: 'Dependency DAG Synthesis', icon: Network, desc: 'Directed relation graph computation' },
    { label: 'Gemini Context Indexing', icon: Sparkles, desc: 'pgvector semantic chunking' },
  ];

  return (
    <div className="bg-charcoal-850 border border-charcoal-750 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-charcoal-800">
        <h3 className="text-sm font-semibold text-white tracking-tight">Analysis Engine Pipeline</h3>
        <span className="text-xs text-indigo-400 font-mono flex items-center gap-1.5">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Processing Codebase...
        </span>
      </div>

      <div className="space-y-3">
        {steps.map((step, idx) => {
          const isDone = currentStep > idx;
          const isCurrent = currentStep === idx;
          const Icon = step.icon;

          return (
            <div
              key={step.label}
              className={`flex items-start gap-3.5 p-3 rounded-lg border transition-all ${
                isDone
                  ? 'bg-charcoal-800/80 border-emerald-900/40'
                  : isCurrent
                  ? 'bg-indigo-950/20 border-indigo-800/60 shadow-subtle'
                  : 'bg-charcoal-900/40 border-charcoal-800 opacity-50'
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                ) : (
                  <Icon className="w-4 h-4 text-slate-400" />
                )}
              </div>
              <div>
                <p
                  className={`text-xs font-semibold ${
                    isDone ? 'text-emerald-300' : isCurrent ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
