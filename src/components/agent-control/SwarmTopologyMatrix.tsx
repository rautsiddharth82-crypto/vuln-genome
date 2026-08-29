import React from 'react';
import { motion } from 'motion/react';
import { AIAgent, AgentId } from '../../types';
import { Shield, Wrench, CheckCircle2, History, Flame, Dna, Activity, ArrowRight, Zap } from 'lucide-react';

interface SwarmTopologyMatrixProps {
  agents: AIAgent[];
  selectedAgentId: AgentId | null;
  onSelectAgent: (id: AgentId) => void;
}

export const SwarmTopologyMatrix: React.FC<SwarmTopologyMatrixProps> = ({
  agents,
  selectedAgentId,
  onSelectAgent,
}) => {
  const getAgentIcon = (id: AgentId) => {
    switch (id) {
      case 'agent-sentinel':
        return <Shield className="w-5 h-5 text-amber-400" />;
      case 'agent-synthesizer':
        return <Wrench className="w-5 h-5 text-emerald-400" />;
      case 'agent-veritas':
        return <CheckCircle2 className="w-5 h-5 text-cyan-400" />;
      case 'agent-chrono':
        return <History className="w-5 h-5 text-purple-400" />;
      case 'agent-redstorm':
        return <Flame className="w-5 h-5 text-red-400" />;
      case 'agent-curator':
        return <Dna className="w-5 h-5 text-amber-300" />;
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'ANALYZING':
        return 'bg-amber-400 animate-pulse';
      case 'EXECUTING':
        return 'bg-emerald-400 animate-pulse';
      case 'VERIFYING':
        return 'bg-cyan-400 animate-pulse';
      case 'ALERT':
        return 'bg-red-400 animate-ping';
      case 'PAUSED':
        return 'bg-gray-400';
      default:
        return 'bg-emerald-500';
    }
  };

  return (
    <div className="glass-frame rounded-2xl p-5 relative overflow-hidden space-y-4">
      {/* Background Matrix Visual Accent */}
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#B88A52]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCC7AE]/50 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#3B2418] text-[#B88A52]">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-display text-[#24150F] uppercase tracking-wide">
              Neural Swarm Topology & Handoff Pipeline
            </h3>
            <p className="text-[11px] text-[#5A3825]">
              Real-time multi-agent autonomous dataflow and AST transformation bus
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            SYNCHRONIZED BUS (0.4ms)
          </span>
          <span className="hidden sm:inline text-[#5A3825]">AST Channel: Encrypted IPC</span>
        </div>
      </div>

      {/* Interactive Topology Graph Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
        {agents.map((agent, index) => {
          const isSelected = selectedAgentId === agent.id;
          return (
            <motion.div
              key={agent.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => onSelectAgent(agent.id)}
              className={`p-3.5 rounded-xl cursor-pointer transition-all relative flex flex-col justify-between border ${
                isSelected
                  ? 'bg-[#3B2418] text-[#FFF9F0] border-[#B88A52] shadow-lg ring-2 ring-[#B88A52]/30'
                  : 'glass-pill hover:bg-white/90 text-[#24150F] border-[#DCC7AE]/70'
              }`}
            >
              {/* Top Row: Icon + Status */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected ? 'bg-[#24150F]' : 'bg-[#F5EBDD]'
                    } shadow-xs`}
                  >
                    {getAgentIcon(agent.id)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${getStatusDot(agent.status)}`} />
                    <span
                      className={`text-[9px] font-mono font-bold uppercase ${
                        isSelected ? 'text-[#DCC7AE]' : 'text-[#5A3825]'
                      }`}
                    >
                      {agent.status}
                    </span>
                  </div>
                </div>

                {/* Agent Name & Role */}
                <div className="font-bold text-xs truncate">{agent.name}</div>
                <div
                  className={`text-[10px] truncate ${
                    isSelected ? 'text-[#B88A52]' : 'text-[#5A3825]'
                  }`}
                >
                  {agent.role}
                </div>
              </div>

              {/* Bottom Metrics Bar */}
              <div className="mt-3 pt-2 border-t border-[#DCC7AE]/40 space-y-1">
                <div className="flex items-center justify-between text-[9px] font-mono">
                  <span className={isSelected ? 'text-[#DCC7AE]' : 'text-[#5A3825]'}>Throughput:</span>
                  <span className="font-bold truncate max-w-[70px]">{agent.metrics.throughputPerSec}</span>
                </div>
                <div className="w-full bg-[#DCC7AE]/50 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#B88A52] h-full rounded-full transition-all duration-500"
                    style={{ width: `${agent.confidence}%` }}
                  />
                </div>
              </div>

              {/* Inter-Agent Directional Arrow indicator */}
              {index < agents.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[#B88A52]">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Autonomous Handoff Summary Strip */}
      <div className="p-3 rounded-xl bg-[#24150F] text-[#FFF9F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono border border-[#5A3825]">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#B88A52] animate-bounce shrink-0" />
          <span className="text-[#DCC7AE]">Active Pipeline:</span>
          <span className="text-amber-400 font-bold truncate">
            Sentinel (AST Sink) → Synthesizer (Zero-Reg Diff) → Veritas (Z3 Invariant)
          </span>
        </div>
        <div className="text-[11px] text-[#B88A52] shrink-0 font-semibold">
          Auto-Resolution: 100% Invariant Compliant
        </div>
      </div>
    </div>
  );
};
