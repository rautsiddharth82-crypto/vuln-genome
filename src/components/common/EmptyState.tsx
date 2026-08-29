import React from 'react';
import { ShieldCheck, AlertCircle, RefreshCw, PlusCircle, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`p-10 rounded-2xl bg-[#FFFDF9] border border-[#DCC7AE]/70 shadow-sm text-center flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#F5EBDD] border border-[#DCC7AE] flex items-center justify-center mb-4 text-[#B88A52]">
        {icon || <ShieldCheck className="w-7 h-7 text-[#B88A52]" />}
      </div>
      <h3 className="text-base font-bold font-display text-[#24150F]">{title}</h3>
      <p className="mt-1 text-xs text-[#5A3825] max-w-md leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3B2418] hover:bg-[#5A3825] text-[#FFF9F0] text-xs font-bold transition-colors shadow-sm"
        >
          <PlusCircle className="w-4 h-4 text-[#B88A52]" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'System Gateway Error',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`p-8 rounded-2xl bg-red-50/50 border border-red-200 text-center flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mb-3 text-red-600">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-red-950 font-display">{title}</h3>
      <p className="mt-1 text-xs text-red-800/80 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-semibold transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
};

export const LoadingSkeleton: React.FC<{ rows?: number; className?: string }> = ({
  rows = 4,
  className = '',
}) => {
  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 bg-[#DCC7AE]/30 rounded-xl w-full" />
      ))}
    </div>
  );
};
