import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AIAgent, AgentId } from '../../types';
import { 
  Shield, 
  Wrench, 
  CheckCircle2, 
  History, 
  Flame, 
  Dna, 
  Cpu, 
  Pause, 
  Play, 
  Sliders, 
  MessageSquareCode, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Terminal,
  Activity
} from 'lucide-react';

interface AgentCardProps {
  agent: AIAgent;
  isSelected: boolean;
  onSelect: (id: AgentId) => void;
  onPause: (id: AgentId) => void;
  onResume: (id: AgentId) => void;
  onUpdateAutonomy: (id: AgentId, level: 'SUPERVISED' | 'SEMI_AUTONOMOUS' | 'FULL_AUTONOMOUS') => void;
  onUpdateParams: (id: AgentId, temp: number, safety: number) => void;
  onOpenReasoningModal: (agent: AIAgent) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  isSelected,
  onSelect,
  onPause,
  onResume,
  onUpdateAutonomy,
  onUpdateParams,
  onOpenReasoningModal,
}) => {
  const [showConfig, setShowConfig] = useState(false);
  const [showThoughts, setShowThoughts] = useState(false);
  const [tempValue, setTempValue] = useState(agent.temperature);
  const [safetyValue, setSafetyValue] = useState(agent.safetyThreshold);

  const getAgentIcon = (id: AgentId) => {
    switch (id) {
      case 'agent-sentinel':
        return <Shield className="w-5 h-5 text-amber-500" />;
      case 'agent-synthesizer':
        return <Wrench className="w-5 h-5 text-emerald-500" />;
      case 'agent-veritas':
        return <CheckCircle2 className="w-5 h-5 text-cyan-500" />;
      case 'agent-chrono':
        return <History className="w-5 h-5 text-purple-500" />;
      case 'agent-redstorm':
        return <Flame className="w-5 h-5 text-red-500" />;
      case 'agent-curator':
        return <Dna className="w-5 h-5 text-amber-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ANALYZING':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'EXECUTING':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'VERIFYING':
        return 'bg-cyan-100 text-cyan-900 border-cyan-300';
      case 'ALERT':
        return 'bg-red-100 text-red-900 border-red-300';
      case 'PAUSED':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    }
  };

  const handleSaveParams = () => {
    onUpdateParams(agent.id, tempValue, safetyValue);
    setShowConfig(false);
  };

  return (
    <div
      className={`glass-frame rounded-2xl p-5 space-y-4 transition-all duration-300 ${
        isSelected ? 'ring-2 ring-[#B88A52] shadow-xl' : 'hover:shadow-md'
      }`}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="p-3 rounded-xl bg-[#F5EBDD] border border-[#DCC7AE]/80 shadow-xs shrink-0">
            {getAgentIcon(agent.id)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold font-display text-[#24150F] truncate">
                {agent.name}
              </h4>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-[#24150F] text-[#FFF9F0] font-bold shrink-0">
                {agent.codename}
              </span>
            </div>
            <p className="text-xs text-[#5A3825] truncate">{agent.role}</p>
          </div>
        </div>

        {/* Status Pill & Power Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase border shadow-xs ${getStatusBadge(
              agent.status
            )}`}
          >
            {agent.status}
          </span>
          {agent.status === 'PAUSED' ? (
            <button
              onClick={() => onResume(agent.id)}
              className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shadow-xs"
              title="Resume Agent Operations"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
          ) : (
            <button
              onClick={() => onPause(agent.id)}
              className="p-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors cursor-pointer shadow-xs"
              title="Pause Agent Operations"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
            </button>
          )}
        </div>
      </div>

      {/* Current Task Display */}
      <div className="p-3 rounded-xl bg-white/60 border border-[#DCC7AE]/60 space-y-1.5 shadow-inner">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold text-[#5A3825]">
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3 h-3 text-[#B88A52]" />
            Active Sub-Process Task
          </span>
          <span className="text-[#B88A52]">{agent.progress}%</span>
        </div>
        <p className="text-xs font-mono text-[#24150F] truncate">
          {agent.currentTask || 'Awaiting task dispatch from Swarm Commander'}
        </p>
        <div className="w-full bg-[#DCC7AE]/50 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#3B2418] h-full rounded-full transition-all duration-300"
            style={{ width: `${agent.progress}%` }}
          />
        </div>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
        <div className="p-2 rounded-xl glass-pill">
          <div className="text-[9px] text-[#5A3825] uppercase font-bold">Compute Load</div>
          <div className="font-bold text-[#24150F] mt-0.5">{agent.metrics.cpuUsagePct}% CPU</div>
        </div>
        <div className="p-2 rounded-xl glass-pill">
          <div className="text-[9px] text-[#5A3825] uppercase font-bold">Throughput</div>
          <div className="font-bold text-[#B88A52] mt-0.5 truncate">{agent.metrics.throughputPerSec}</div>
        </div>
        <div className="p-2 rounded-xl glass-pill">
          <div className="text-[9px] text-[#5A3825] uppercase font-bold">Accuracy</div>
          <div className="font-bold text-emerald-800 mt-0.5">{agent.metrics.accuracyRate}%</div>
        </div>
      </div>

      {/* Capabilities Tag Cloud */}
      <div className="space-y-1.5">
        <div className="text-[10px] uppercase font-mono font-bold text-[#5A3825]">Core Capabilities:</div>
        <div className="flex flex-wrap gap-1.5">
          {agent.capabilities.slice(0, 3).map((cap, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-md bg-[#3B2418]/5 text-[#3B2418] border border-[#DCC7AE]/70 font-mono text-[10px]"
            >
              {cap}
            </span>
          ))}
          {agent.capabilities.length > 3 && (
            <span className="px-2 py-0.5 rounded-md bg-[#B88A52]/10 text-[#5A3825] font-mono text-[10px]">
              +{agent.capabilities.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="pt-2 border-t border-[#DCC7AE]/60 flex items-center justify-between gap-2">
        <button
          onClick={() => onOpenReasoningModal(agent)}
          className="flex-1 py-2 px-3 rounded-xl bg-[#3B2418] hover:bg-[#5A3825] text-[#FFF9F0] text-xs font-mono font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#B88A52]" />
          <span>Ask Agent AI</span>
        </button>

        <button
          onClick={() => setShowThoughts(!showThoughts)}
          className="p-2 rounded-xl glass-pill hover:bg-white text-[#3B2418] text-xs font-mono transition-colors cursor-pointer"
          title="Toggle Thought Stream Logs"
        >
          <MessageSquareCode className="w-4 h-4 text-[#B88A52]" />
        </button>

        <button
          onClick={() => setShowConfig(!showConfig)}
          className="p-2 rounded-xl glass-pill hover:bg-white text-[#3B2418] text-xs font-mono transition-colors cursor-pointer"
          title="Tune Parameters & Autonomy"
        >
          <Sliders className="w-4 h-4 text-[#B88A52]" />
        </button>
      </div>

      {/* Collapsible Configuration Tuning Drawer */}
      <AnimatePresence>
        {showConfig && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3.5 rounded-xl bg-[#24150F] text-[#FFF9F0] space-y-3 text-xs font-mono border border-[#5A3825]"
          >
            <div className="flex items-center justify-between border-b border-[#5A3825] pb-2 font-bold text-[#B88A52]">
              <span>Tuning Parameters</span>
              <span className="text-[10px] text-[#DCC7AE]">ID: {agent.id}</span>
            </div>

            {/* Autonomy Level */}
            <div>
              <label className="text-[10px] text-[#DCC7AE] block mb-1">Autonomy Level:</label>
              <div className="grid grid-cols-3 gap-1">
                {(['SUPERVISED', 'SEMI_AUTONOMOUS', 'FULL_AUTONOMOUS'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => onUpdateAutonomy(agent.id, level)}
                    className={`py-1 px-1 rounded-md text-[9px] font-bold uppercase transition-all ${
                      agent.autonomyLevel === level
                        ? 'bg-[#B88A52] text-[#24150F]'
                        : 'bg-[#3B2418] text-[#DCC7AE] hover:bg-[#5A3825]'
                    }`}
                  >
                    {level.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Reasoning Temperature */}
            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-[#DCC7AE]">Reasoning Temperature:</span>
                <span className="font-bold text-[#B88A52]">{tempValue.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={tempValue}
                onChange={(e) => setTempValue(parseFloat(e.target.value))}
                className="w-full accent-[#B88A52] cursor-pointer"
              />
            </div>

            {/* Safety Proof Threshold */}
            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-[#DCC7AE]">Safety Verification Threshold:</span>
                <span className="font-bold text-emerald-400">{safetyValue}%</span>
              </div>
              <input
                type="range"
                min="90"
                max="100"
                step="0.5"
                value={safetyValue}
                onChange={(e) => setSafetyValue(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <button
              type="button"
              onClick={handleSaveParams}
              className="w-full py-1.5 rounded-lg bg-[#B88A52] hover:bg-[#d6a56b] text-[#24150F] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Apply Changes
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsible Real-time Thought Stream Drawer */}
      <AnimatePresence>
        {showThoughts && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 rounded-xl bg-[#1C100B] text-[#FFF9F0] space-y-2 text-[11px] font-mono border border-[#5A3825]"
          >
            <div className="flex items-center justify-between text-[#B88A52] font-bold border-b border-[#5A3825]/50 pb-1.5">
              <span>Agent Thought Stream</span>
              <span className="text-[9px] text-[#DCC7AE]">{agent.reasoningLogs.length} events logged</span>
            </div>

            <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
              {agent.reasoningLogs.length === 0 ? (
                <div className="text-gray-500 italic py-2 text-center">No recent thoughts logged.</div>
              ) : (
                agent.reasoningLogs.map((log) => (
                  <div key={log.id} className="p-2 rounded-lg bg-[#24150F] border border-[#5A3825]/60 space-y-1">
                    <div className="flex items-center justify-between text-[9px] text-[#B88A52]">
                      <span className="font-bold">[{log.type}]</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <div className="font-bold text-[#FFF9F0]">{log.summary}</div>
                    <div className="text-[10px] text-[#DCC7AE] leading-relaxed">{log.detail}</div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
