import React from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Workflow, 
  SearchCode, 
  ShieldAlert, 
  Wrench, 
  Award, 
  Dna,
  CheckCircle2,
  Loader2
} from 'lucide-react';

export type PipelineStage = 'LEARN' | 'EXTRACT' | 'SCAN' | 'CONFIRM' | 'PATCH' | 'PROVE' | 'REMEMBER' | 'COMPLETE';

interface ScanPipelineProgressProps {
  currentStage: PipelineStage;
  progress: number;
  filesScanned: number;
  linesAnalyzed: number;
  genomesMatched: number;
  testsExecuted: number;
  className?: string;
}

export const ScanPipelineProgress: React.FC<ScanPipelineProgressProps> = ({
  currentStage,
  progress,
  filesScanned,
  linesAnalyzed,
  genomesMatched,
  testsExecuted,
  className = '',
}) => {
  const stages: Array<{ id: PipelineStage; label: string; icon: React.ReactNode; description: string }> = [
    { id: 'LEARN', label: 'LEARN', icon: <BookOpen className="w-4 h-4" />, description: 'Ingest AST & Rules' },
    { id: 'EXTRACT', label: 'EXTRACT', icon: <Workflow className="w-4 h-4" />, description: 'Map Sinks & Taint' },
    { id: 'SCAN', label: 'SCAN', icon: <SearchCode className="w-4 h-4" />, description: 'Genome Pattern Match' },
    { id: 'CONFIRM', label: 'CONFIRM', icon: <ShieldAlert className="w-4 h-4" />, description: 'Fuzzing & Exploit PoC' },
    { id: 'PATCH', label: 'PATCH', icon: <Wrench className="w-4 h-4" />, description: 'CrewAI Synthesis' },
    { id: 'PROVE', label: 'PROVE', icon: <Award className="w-4 h-4" />, description: 'Regression & Defense Proof' },
    { id: 'REMEMBER', label: 'REMEMBER', icon: <Dna className="w-4 h-4" />, description: 'Record Invariant to Genome' },
  ];

  const stageOrder: PipelineStage[] = ['LEARN', 'EXTRACT', 'SCAN', 'CONFIRM', 'PATCH', 'PROVE', 'REMEMBER', 'COMPLETE'];
  const currentIndex = stageOrder.indexOf(currentStage);

  return (
    <div className={`p-6 rounded-2xl bg-[#FFFDF9] border border-[#DCC7AE]/80 shadow-sm ${className}`}>
      {/* Header with Title & Overall Progress */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-[#5A3825] font-bold">
            Autonomous Cyber Defense Engine
          </div>
          <h3 className="text-xl font-bold font-display text-[#24150F] mt-0.5">
            Security Lifecycle Pipeline
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-2xl font-black font-display text-[#3B2418]">{progress}%</span>
            <span className="text-[11px] text-[#5A3825] block font-mono">Orchestrator Status</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#3B2418] text-[#FFF9F0] flex items-center justify-center shadow-sm">
            {progress === 100 ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <Loader2 className="w-5 h-5 text-[#B88A52] animate-spin" />
            )}
          </div>
        </div>
      </div>

      {/* Progress Track Bar */}
      <div className="w-full bg-[#DCC7AE]/40 h-2.5 rounded-full overflow-hidden mb-8">
        <motion.div
          className="h-full bg-linear-to-r from-[#3B2418] via-[#B88A52] to-emerald-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* 7-Step Pipeline Nodes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {stages.map((stg, idx) => {
          const isDone = currentIndex > idx;
          const isCurrent = currentIndex === idx;
          const isPending = currentIndex < idx;

          return (
            <div
              key={stg.id}
              className={`p-3 rounded-xl border transition-all flex flex-col items-center text-center relative ${
                isCurrent
                  ? 'bg-[#3B2418] text-[#FFF9F0] border-[#B88A52] shadow-md ring-2 ring-[#B88A52]/40'
                  : isDone
                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                  : 'bg-[#F5EBDD]/40 border-[#DCC7AE]/60 text-[#5A3825]/60'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center mb-1.5 ${
                  isCurrent
                    ? 'bg-[#B88A52] text-[#24150F]'
                    : isDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#DCC7AE]/60 text-[#5A3825]'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : stg.icon}
              </div>
              <span className="text-[11px] font-mono font-bold tracking-wider">{stg.label}</span>
              <span
                className={`text-[9px] mt-0.5 leading-tight ${
                  isCurrent ? 'text-[#DCC7AE]' : isDone ? 'text-emerald-800' : 'text-[#5A3825]/60'
                }`}
              >
                {stg.description}
              </span>

              {isCurrent && (
                <span className="absolute -top-1.5 right-2 w-2 h-2 rounded-full bg-[#B88A52] animate-ping" />
              )}
            </div>
          );
        })}
      </div>

      {/* Real-time Telemetry Stats */}
      <div className="mt-6 pt-5 border-t border-[#DCC7AE]/50 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="p-2.5 rounded-xl bg-[#F5EBDD]/50 border border-[#DCC7AE]/40">
          <div className="text-base font-extrabold font-mono text-[#24150F]">
            {filesScanned.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#5A3825] uppercase font-mono tracking-wider font-semibold">
            Files Scanned
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-[#F5EBDD]/50 border border-[#DCC7AE]/40">
          <div className="text-base font-extrabold font-mono text-[#24150F]">
            {linesAnalyzed.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#5A3825] uppercase font-mono tracking-wider font-semibold">
            Lines Analyzed
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-[#F5EBDD]/50 border border-[#DCC7AE]/40">
          <div className="text-base font-extrabold font-mono text-[#B88A52]">
            {genomesMatched}
          </div>
          <div className="text-[10px] text-[#5A3825] uppercase font-mono tracking-wider font-semibold">
            Genomes Matched
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-[#F5EBDD]/50 border border-[#DCC7AE]/40">
          <div className="text-base font-extrabold font-mono text-emerald-700">
            {testsExecuted}
          </div>
          <div className="text-[10px] text-[#5A3825] uppercase font-mono tracking-wider font-semibold">
            Tests Executed
          </div>
        </div>
      </div>
    </div>
  );
};
