import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  onClick,
  hoverable = false,
  glow = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'relative glass-panel border border-charcoal-700/80 rounded-2xl p-5 transition-all duration-200 overflow-hidden',
        'before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:pointer-events-none',
        hoverable &&
          'hover:border-indigo-500/40 hover:shadow-panel hover:-translate-y-0.5 cursor-pointer',
        glow && 'shadow-glow border-indigo-500/35',
        className
      )}
    >
      {children}
    </div>
  );
};
