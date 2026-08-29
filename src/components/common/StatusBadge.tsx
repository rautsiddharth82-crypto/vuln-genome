import React from 'react';
import { VulnStatus } from '../../types';
import { CheckCircle2, Cpu, Wrench, ShieldX, Clock, ShieldCheck } from 'lucide-react';

interface StatusBadgeProps {
  status: VulnStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const styles: Record<VulnStatus, { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
    CONFIRMED: {
      label: 'Confirmed Vulnerability',
      bg: 'bg-red-500/10',
      text: 'text-red-800 font-semibold',
      border: 'border-red-500/30',
      icon: <ShieldX className="w-3.5 h-3.5 text-red-600 shrink-0" />,
    },
    PATCH_GENERATED: {
      label: 'Patch Synthesized',
      bg: 'bg-amber-500/10',
      text: 'text-amber-800 font-semibold',
      border: 'border-amber-500/30',
      icon: <Wrench className="w-3.5 h-3.5 text-amber-700 shrink-0" />,
    },
    PATCHING: {
      label: 'Patch Synthesized',
      bg: 'bg-amber-500/10',
      text: 'text-amber-800 font-semibold',
      border: 'border-amber-500/30',
      icon: <Wrench className="w-3.5 h-3.5 text-amber-700 shrink-0" />,
    },
    VERIFIED: {
      label: 'Patch Verified (6/6)',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-800 font-semibold',
      border: 'border-emerald-500/30',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
    },
    FIXED: {
      label: 'Fixed & Certified',
      bg: 'bg-emerald-600/15',
      text: 'text-emerald-900 font-bold',
      border: 'border-emerald-600/40',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />,
    },
    IGNORED: {
      label: 'Ignored / False Positive',
      bg: 'bg-[#5A3825]/10',
      text: 'text-[#5A3825] font-medium',
      border: 'border-[#5A3825]/20',
      icon: <Clock className="w-3.5 h-3.5 text-[#5A3825]/70 shrink-0" />,
    },
    PENDING: {
      label: 'Pending Ingestion',
      bg: 'bg-[#B88A52]/15',
      text: 'text-[#5A3825] font-medium',
      border: 'border-[#B88A52]/40',
      icon: <Cpu className="w-3.5 h-3.5 text-[#B88A52] shrink-0" />,
    },
  };

  const current = styles[status] || styles.PENDING;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border tracking-wide font-sans ${current.bg} ${current.text} ${current.border} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && current.icon}
      <span>{current.label}</span>
    </span>
  );
};
