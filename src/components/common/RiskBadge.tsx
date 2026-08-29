import React from 'react';
import { Severity } from '../../types';
import { ShieldAlert, AlertTriangle, AlertCircle, Info, ShieldCheck } from 'lucide-react';

interface RiskBadgeProps {
  severity: Severity;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  severity,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const styles: Record<Severity, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
    CRITICAL: {
      bg: 'bg-red-950/15',
      text: 'text-red-700 font-bold',
      border: 'border-red-600/40',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-red-600 shrink-0" />,
    },
    HIGH: {
      bg: 'bg-orange-950/15',
      text: 'text-orange-700 font-bold',
      border: 'border-orange-600/40',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-600 shrink-0" />,
    },
    MEDIUM: {
      bg: 'bg-amber-950/15',
      text: 'text-amber-800 font-semibold',
      border: 'border-amber-600/40',
      icon: <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />,
    },
    LOW: {
      bg: 'bg-emerald-950/15',
      text: 'text-emerald-800 font-semibold',
      border: 'border-emerald-600/40',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
    },
    INFO: {
      bg: 'bg-[#5A3825]/10',
      text: 'text-[#5A3825] font-semibold',
      border: 'border-[#5A3825]/30',
      icon: <Info className="w-3.5 h-3.5 text-[#B88A52] shrink-0" />,
    },
  };

  const current = styles[severity] || styles.INFO;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border tracking-wider uppercase font-mono ${current.bg} ${current.text} ${current.border} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && current.icon}
      <span>{severity}</span>
    </span>
  );
};
