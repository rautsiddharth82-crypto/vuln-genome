import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Crosshair, Wrench, CheckCheck, AlertCircle } from 'lucide-react';

interface SecurityScoreProps {
  score: number; // 0 to 100
  detectionRate?: number;
  patchSuccessRate?: number;
  verificationAccuracy?: number;
  falsePositiveRate?: number;
  className?: string;
}

export const SecurityScore: React.FC<SecurityScoreProps> = ({
  score = 94,
  detectionRate = 99.4,
  patchSuccessRate = 96.8,
  verificationAccuracy = 99.9,
  falsePositiveRate = 0.8,
  className = '',
}) => {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getStatusText = (val: number) => {
    if (val >= 90) return { label: 'DEFENSE GRADE // OPTIMAL', color: 'text-emerald-700', bg: 'bg-emerald-500/10' };
    if (val >= 75) return { label: 'ELEVATED VIGILANCE', color: 'text-amber-800', bg: 'bg-amber-500/10' };
    return { label: 'CRITICAL EXPOSURE', color: 'text-red-700', bg: 'bg-red-500/10' };
  };

  const status = getStatusText(score);

  return (
    <div
      className={`p-6 rounded-2xl glass-frame flex flex-col md:flex-row items-center justify-between gap-8 ${className}`}
    >
      {/* Left: Circular Gauge */}
      <div className="flex flex-col items-center justify-center shrink-0">
        <div className="relative w-44 h-44 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
            {/* Track background */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-[#DCC7AE]/40"
            />
            {/* Animated Progress bar */}
            <motion.circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              strokeLinecap="round"
              className="text-[#B88A52]"
            />
          </svg>

          {/* Centered value */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-extrabold text-[#24150F] font-display"
            >
              {score}
            </motion.span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#5A3825]/80 font-bold">
              / 100 Index
            </span>
          </div>
        </div>

        <div className={`mt-3 px-3.5 py-1 rounded-full text-xs font-mono font-bold tracking-wider border border-white/60 shadow-xs ${status.bg} ${status.color}`}>
          {status.label}
        </div>
      </div>

      {/* Right: Detailed Supporting Metrics */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {/* Metric 1: Detection Rate */}
        <div className="p-3.5 rounded-xl glass-pill flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#5A3825] font-semibold">
            <span className="flex items-center gap-1.5">
              <Crosshair className="w-4 h-4 text-[#B88A52]" />
              Detection Rate
            </span>
            <span className="font-mono font-bold text-[#24150F]">{detectionRate}%</span>
          </div>
          <div className="w-full bg-[#DCC7AE]/60 h-2 rounded-full mt-2 overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${detectionRate}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className="bg-[#B88A52] h-full rounded-full"
            />
          </div>
        </div>

        {/* Metric 2: Patch Success */}
        <div className="p-3.5 rounded-xl glass-pill flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#5A3825] font-semibold">
            <span className="flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-emerald-700" />
              Patch Success
            </span>
            <span className="font-mono font-bold text-[#24150F]">{patchSuccessRate}%</span>
          </div>
          <div className="w-full bg-[#DCC7AE]/60 h-2 rounded-full mt-2 overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${patchSuccessRate}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="bg-emerald-600 h-full rounded-full"
            />
          </div>
        </div>

        {/* Metric 3: Verification Accuracy */}
        <div className="p-3.5 rounded-xl glass-pill flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#5A3825] font-semibold">
            <span className="flex items-center gap-1.5">
              <CheckCheck className="w-4 h-4 text-[#B88A52]" />
              Verification Accuracy
            </span>
            <span className="font-mono font-bold text-[#24150F]">{verificationAccuracy}%</span>
          </div>
          <div className="w-full bg-[#DCC7AE]/60 h-2 rounded-full mt-2 overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${verificationAccuracy}%` }}
              transition={{ duration: 1, delay: 0.4 }}
              className="bg-[#B88A52] h-full rounded-full"
            />
          </div>
        </div>

        {/* Metric 4: False Positive Rate */}
        <div className="p-3.5 rounded-xl glass-pill flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#5A3825] font-semibold">
            <span className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-emerald-700" />
              False Positive Rate
            </span>
            <span className="font-mono font-bold text-[#24150F]">{falsePositiveRate}%</span>
          </div>
          <div className="w-full bg-[#DCC7AE]/60 h-2 rounded-full mt-2 overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, falsePositiveRate * 10)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-emerald-600 h-full rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
