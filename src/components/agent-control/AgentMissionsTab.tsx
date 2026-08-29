import React from 'react';
import { AgentMission } from '../../types';
import { 
  CheckCircle2, 
  Clock, 
  Layers, 
  Terminal, 
  Award, 
  ShieldCheck, 
  AlertTriangle,
  ChevronRight,
  Activity
} from 'lucide-react';

interface AgentMissionsTabProps {
  missions: AgentMission[];
}

export const AgentMissionsTab: React.FC<AgentMissionsTabProps> = ({ missions }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold font-display text-[#24150F]">
            Autonomous Mission Operations Log
          </h3>
          <p className="text-xs text-[#5A3825]">
            Chronological audit of multi-agent tasks, AST invariant scans, and formal proofs
          </p>
        </div>
        <span className="text-xs font-mono text-[#5A3825]">
          {missions.length} Missions Registered
        </span>
      </div>

      <div className="space-y-3">
        {missions.map((mission) => {
          const isComplete = mission.status === 'COMPLETED';
          return (
            <div
              key={mission.id}
              className="glass-frame rounded-2xl p-5 space-y-4 hover:shadow-md transition-all"
            >
              {/* Mission Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCC7AE]/50 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl ${
                      isComplete ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Activity className="w-5 h-5 animate-spin" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold font-display text-[#24150F]">{mission.title}</h4>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#24150F] text-[#FFF9F0]">
                        {mission.id}
                      </span>
                    </div>
                    <p className="text-xs text-[#5A3825]">{mission.objective}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-[#5A3825]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{mission.startedAt}</span>
                </div>
              </div>

              {/* Commander Directive */}
              <div className="p-3 rounded-xl bg-[#24150F] text-[#FFF9F0] text-xs font-mono border border-[#5A3825] space-y-1">
                <div className="text-[10px] text-[#B88A52] uppercase font-bold">Commander Directive:</div>
                <div className="text-[#DCC7AE] italic leading-relaxed">"{mission.commanderDirective}"</div>
              </div>

              {/* Execution Steps */}
              {mission.executionSteps && mission.executionSteps.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-mono font-bold uppercase text-[#5A3825] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#B88A52]" />
                    <span>Orchestrated Execution Pipeline ({mission.executionSteps.length} Steps):</span>
                  </div>

                  <div className="space-y-1.5">
                    {mission.executionSteps.map((step, idx) => (
                      <div
                        key={step.id || idx}
                        className="p-2.5 rounded-xl glass-pill flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#3B2418] text-[#FFF9F0] flex items-center justify-center text-[10px] font-bold shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-[#24150F]">{step.stepName}</span>
                          <span className="text-[10px] text-[#B88A52] font-semibold">
                            [{step.agentName}]
                          </span>
                        </div>

                        <div className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{step.output}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mission Outcomes KPI Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-[#DCC7AE]/50 text-center font-mono text-xs">
                <div className="p-2 rounded-xl bg-white/60">
                  <div className="text-[9px] text-[#5A3825] uppercase font-bold">Threats Sealed</div>
                  <div className="font-bold text-emerald-800 mt-0.5">
                    {mission.results.threatsBlocked} Intercepted
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white/60">
                  <div className="text-[9px] text-[#5A3825] uppercase font-bold">Patches Synthesized</div>
                  <div className="font-bold text-[#24150F] mt-0.5">
                    {mission.results.patchesSynthesized} Zero-Reg Diff
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white/60">
                  <div className="text-[9px] text-[#5A3825] uppercase font-bold">Z3 Proofs Verified</div>
                  <div className="font-bold text-cyan-800 mt-0.5">
                    {mission.results.proofsVerified} Signed
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white/60">
                  <div className="text-[9px] text-[#5A3825] uppercase font-bold">Status</div>
                  <div className="font-bold text-[#B88A52] mt-0.5">{mission.status}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
