import React from 'react';
import { MembershipStatus } from '@/types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'lime' | 'gray' | 'cyan' | 'coral' | 'amber' | 'purple';
  status?: MembershipStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant,
  status,
  size = 'md',
  className = '',
}) => {
  // If status is provided, auto-map to standard membership colors
  let resolvedVariant = variant || 'lime';
  if (status) {
    switch (status) {
      case 'active':
        resolvedVariant = 'lime';
        break;
      case 'expiring_soon':
        resolvedVariant = 'amber';
        break;
      case 'urgent':
        resolvedVariant = 'coral';
        break;
      case 'not_yet_active':
        resolvedVariant = 'purple';
        break;
      case 'expired':
        resolvedVariant = 'gray';
        break;
    }
  }

  const variantStyles = {
    lime: 'bg-lime-500/10 text-lime-400 border-lime-500/30',
    gray: 'bg-gray-800 text-gray-400 border-gray-700',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    coral: 'bg-coral-500/10 text-coral-400 border-coral-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold tracking-wide uppercase rounded-full border ${variantStyles[resolvedVariant]} ${sizeStyles[size]} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {children}
    </span>
  );
};
