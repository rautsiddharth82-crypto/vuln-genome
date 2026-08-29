import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Clock, 
  Dna, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  FileCode,
  Zap,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { INITIAL_TIME_MACHINE_EVENTS } from '../data/mockData';
import { TimeMachineEvent } from '../types';

interface TimeMachinePageProps {
  onNavigate: (route: string) => void;
}

export const TimeMachinePage: React.FC<TimeMachinePageProps> = ({ onNavigate }) => {
  const [events, setEvents] = useState<TimeMachineEvent[]>(INITIAL_TIME_MACHINE_EVENTS);
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0].id);

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  const totalTimeSaved = events.reduce((acc, curr) => acc + curr.timeSavedHours, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#B88A52]">
            <Clock className="w-4 h-4 text-[#B88A52]" />
            Continuous Memory Invariant Chronology
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-[#24150F] tracking-tight mt-0.5">
            Security Time Machine
          </h1>
          <p className="text-xs text-[#5A3825] mt-1">
            Trace how vulnerability invariants were learned once and automatically prevented across future codebases.
          </p>
        </div>

        <div className="p-3 px-4 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black font-display text-emerald-900 leading-tight">
              {totalTimeSaved} Engineer Hours Saved
            </div>
            <div className="text-[10px] text-emerald-800 font-mono">Zero Repeat Exploits</div>
          </div>
        </div>
      </div>

      {/* Interactive Horizontal Timeline Navigator */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#FFFDF9] border border-[#DCC7AE]/80 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#5A3825] font-bold">
            Chronological Invariant Milestones (2025 - 2026)
          </h3>
          <span className="text-xs font-mono text-[#B88A52] font-bold">
            Click epoch to inspect prevention telemetry
          </span>
        </div>

        {/* Timeline Path */}
        <div className="relative py-6">
          <div className="absolute top-1/2 left-4 right-4 h-1 bg-[#DCC7AE] -translate-y-1/2" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            {events.map((evt, idx) => {
              const isSelected = evt.id === selectedEventId;
              return (
                <button
                  key={evt.id}
                  onClick={() => setSelectedEventId(evt.id)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#3B2418] text-[#FFF9F0] border-[#B88A52] shadow-xl scale-105 ring-2 ring-[#B88A52]'
                      : 'bg-[#FFFDF9] text-[#24150F] border-[#DCC7AE] hover:border-[#B88A52]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        isSelected
                          ? 'bg-[#B88A52] text-[#24150F]'
                          : 'bg-[#F5EBDD] text-[#5A3825]'
                      }`}
                    >
                      {evt.date}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#B88A52]">
                      0{idx + 1}
                    </span>
                  </div>

                  <div className="font-bold text-xs truncate my-1">
                    {evt.vulnTitle}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono pt-2 border-t border-black/5 mt-2">
                    <span className={isSelected ? 'text-[#DCC7AE]' : 'text-[#5A3825]'}>
                      {evt.genomeId}
                    </span>
                    <span className="text-emerald-500 font-bold">
                      +{evt.timeSavedHours}h saved
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Milestone Inspector */}
      {selectedEvent && (
        <motion.div
          key={selectedEvent.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 md:p-8 rounded-3xl bg-[#FFFDF9] border-2 border-[#DCC7AE] shadow-md space-y-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#5A3825] mb-1">
                <span className="px-2 py-0.5 rounded bg-[#F5EBDD] border border-[#DCC7AE]">
                  {selectedEvent.date}
                </span>
                <span>•</span>
                <span className="text-[#B88A52]">{selectedEvent.genomeId}</span>
              </div>
              <h2 className="text-2xl font-bold font-display text-[#24150F]">
                {selectedEvent.vulnTitle}
              </h2>
              <p className="text-xs text-[#5A3825] mt-1 font-mono">
                Target Repo: {selectedEvent.repository} • Branch: {selectedEvent.branch}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate(`genomes/${selectedEvent.genomeId}`)}
                className="px-4 py-2 rounded-xl bg-[#3B2418] hover:bg-[#5A3825] text-[#FFF9F0] text-xs font-mono font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
              >
                <Dna className="w-4 h-4 text-[#B88A52]" />
                <span>View Genome Model</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Prevention Narrative */}
            <div className="p-5 rounded-2xl bg-[#F5EBDD]/50 border border-[#DCC7AE]/70 space-y-3">
              <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#3B2418] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Autonomous Prevention Outcome
              </h4>
              <p className="text-xs text-[#5A3825] leading-relaxed">
                {selectedEvent.description}
              </p>
            </div>

            {/* Time & Invariant Stats */}
            <div className="p-5 rounded-2xl bg-[#24150F] text-[#FFF9F0] border border-[#5A3825] space-y-3">
              <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#B88A52] flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#B88A52]" />
                Invariant Execution Metrics
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <span className="text-[#DCC7AE] text-[10px] block">Engineer Hours Saved</span>
                  <span className="text-lg font-bold text-emerald-400">+{selectedEvent.timeSavedHours} Hours</span>
                </div>
                <div>
                  <span className="text-[#DCC7AE] text-[10px] block">Repeat Exploit Rate</span>
                  <span className="text-lg font-bold text-emerald-400">0.00% (Neutralized)</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
