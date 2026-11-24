import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  onClick,
  hoverable = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-charcoal-850/80 backdrop-blur-sm border border-charcoal-750 rounded-xl p-5 transition-all duration-200',
        hoverable && 'hover:border-charcoal-600 hover:bg-charcoal-800/90 cursor-pointer hover:shadow-panel',
        className
      )}
    >
      {children}
    </div>
  );
};
