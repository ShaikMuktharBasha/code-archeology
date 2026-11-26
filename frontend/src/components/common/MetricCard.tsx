import React from 'react';
import { Card } from './Card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  accent?: 'indigo' | 'cyan' | 'emerald' | 'amber';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accent = 'indigo',
}) => {
  const accentStyles = {
    indigo: 'text-indigo-400 bg-indigo-950/60 border-indigo-500/30 shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)]',
    cyan: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30 shadow-[0_0_20px_-5px_rgba(34,211,238,0.4)]',
    emerald: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30 shadow-[0_0_20px_-5px_rgba(52,211,153,0.4)]',
    amber: 'text-amber-400 bg-amber-950/60 border-amber-500/30 shadow-[0_0_20px_-5px_rgba(251,191,36,0.4)]',
  };

  return (
    <Card className="group hover:border-charcoal-600 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-mono font-medium text-slate-400 tracking-widest uppercase">
            {title}
          </p>
          <p className="text-3xl font-bold font-mono text-white mt-2 tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5">
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${accentStyles[accent]}`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 pt-3 border-t border-charcoal-750/80 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{trend}</span>
        </div>
      )}
    </Card>
  );
};
