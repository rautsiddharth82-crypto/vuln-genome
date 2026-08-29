import React from 'react';
import { ArrowDown, AlertTriangle, ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';

interface DataFlowProps {
  source: string;
  transformation: string;
  sink: string;
  missingGuard: string;
  className?: string;
}

export const DataFlowVisualizer: React.FC<DataFlowProps> = ({
  source,
  transformation,
  sink,
  missingGuard,
  className = '',
}) => {
  const steps = [
    {
      title: '1. Untrusted Source',
      content: source,
      icon: <Cpu className="w-4 h-4 text-[#B88A52]" />,
      bg: 'bg-[#FFFDF9]',
      border: 'border-[#DCC7AE]',
      tag: 'INGRESS',
    },
    {
      title: '2. Taint Transformation',
      content: transformation,
      icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
      bg: 'bg-amber-50/50',
      border: 'border-amber-300',
      tag: 'PROPAGATION',
    },
    {
      title: '3. Vulnerable Execution Sink',
      content: sink,
      icon: <ShieldAlert className="w-4 h-4 text-red-600" />,
      bg: 'bg-red-50/50',
      border: 'border-red-300',
      tag: 'EXPLOIT HAZARD',
    },
    {
      title: '4. Autonomous Invariant / Missing Guard',
      content: missingGuard,
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
      bg: 'bg-emerald-50/60',
      border: 'border-emerald-300',
      tag: 'DEFENSE REMEDY',
    },
  ];

  return (
    <div className={`p-5 rounded-2xl bg-[#FFFDF9] border border-[#DCC7AE]/70 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-[#5A3825]">
          Autonomous Taint & Execution Path Trace
        </h4>
        <span className="text-[11px] px-2 py-0.5 rounded bg-[#F5EBDD] text-[#3B2418] font-mono font-semibold">
          AST Flow
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className={`p-4 rounded-xl border ${step.border} ${step.bg} shadow-xs transition-all hover:shadow-sm`}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#24150F]">
                  {step.icon}
                  <span>{step.title}</span>
                </div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-black/5 text-[#5A3825]">
                  {step.tag}
                </span>
              </div>
              <div className="font-mono text-xs text-[#3B2418] bg-black/5 p-2 rounded-lg break-all">
                {step.content}
              </div>
            </div>

            {idx < steps.length - 1 && (
              <div className="flex items-center justify-center my-[-4px]">
                <div className="p-1 rounded-full bg-[#F5EBDD] text-[#B88A52] border border-[#DCC7AE]">
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
