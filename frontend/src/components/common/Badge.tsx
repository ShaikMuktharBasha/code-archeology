import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'indigo' | 'cyan' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
}) => {
  const variantStyles = {
    default: 'bg-charcoal-800/90 text-slate-300 border-charcoal-600/80',
    success: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30 shadow-[0_0_12px_-3px_rgba(52,211,153,0.2)]',
    warning: 'bg-amber-950/60 text-amber-300 border-amber-500/30 shadow-[0_0_12px_-3px_rgba(251,191,36,0.2)]',
    error: 'bg-rose-950/60 text-rose-300 border-rose-500/30 shadow-[0_0_12px_-3px_rgba(244,63,94,0.2)]',
    indigo: 'bg-indigo-950/70 text-indigo-300 border-indigo-500/35 shadow-[0_0_14px_-3px_rgba(99,102,241,0.25)]',
    cyan: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/35 shadow-[0_0_14px_-3px_rgba(34,211,238,0.25)]',
    outline: 'bg-transparent text-slate-400 border-charcoal-700',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wide',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center font-mono font-medium rounded-full border backdrop-blur-sm',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};
