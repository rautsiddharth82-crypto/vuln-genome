import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AIAgent, AgentId, SwarmMode, AgentMission, SwarmControlState } from '../types';
import { agentControlService, AgentCommandResponse } from '../services/agentControlService';
import { SwarmHeaderControls } from '../components/agent-control/SwarmHeaderControls';
import { SwarmTopologyMatrix } from '../components/agent-control/SwarmTopologyMatrix';
import { AgentCard } from '../components/agent-control/AgentCard';
import { AgentCommandTerminal } from '../components/agent-control/AgentCommandTerminal';
import { AgentMissionsTab } from '../components/agent-control/AgentMissionsTab';
import { AgentReasoningModal } from '../components/agent-control/AgentReasoningModal';
import { 
  Bot, 
  Layers, 
  Terminal, 
  History, 
  Sparkles, 
  Activity, 
  Radio, 
  Cpu, 
  ShieldCheck, 
  Filter,
  RefreshCw,
  Search
} from 'lucide-react';

interface AgentControlPageProps {
  onNavigate: (route: string) => void;
}

export const AgentControlPage: React.FC<AgentControlPageProps> = ({ onNavigate }) => {
  const [agents, setAgents] = useState<AIAgent[]>(agentControlService.getAgents());
  const [missions, setMissions] = useState<AgentMission[]>(agentControlService.getMissions());
  const [swarmState, setSwarmState] = useState<SwarmControlState>(agentControlService.getSwarmState());
  const [selectedAgentId, setSelectedAgentId] = useState<AgentId | null>(null);
  const [activeTab, setActiveTab] = useState<'matrix' | 'dispatch' | 'missions' | 'telemetry'>('matrix');
  const [isExecutingCommand, setIsExecutingCommand] = useState(false);
  const [isExecutingMacro, setIsExecutingMacro] = useState(false);
  const [lastCommandResponse, setLastCommandResponse] = useState<AgentCommandResponse | null>(null);
  const [reasoningModalAgent, setReasoningModalAgent] = useState<AIAgent | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    const unsubscribe = agentControlService.subscribe(() => {
      setAgents([...agentControlService.getAgents()]);
      setMissions([...agentControlService.getMissions()]);
      setSwarmState({ ...agentControlService.getSwarmState() });
    });
    return () => unsubscribe();
  }, []);

  const handleSetMode = (mode: SwarmMode) => {
    agentControlService.setSwarmMode(mode);
  };

  const handleToggleKillSwitch = () => {
    agentControlService.toggleKillSwitch();
  };

  const handlePauseAgent = (id: AgentId) => {
    agentControlService.pauseAgent(id);
  };

  const handleResumeAgent = (id: AgentId) => {
    agentControlService.resumeAgent(id);
  };

  const handleUpdateAutonomy = (id: AgentId, level: 'SUPERVISED' | 'SEMI_AUTONOMOUS' | 'FULL_AUTONOMOUS') => {
    agentControlService.updateAgentAutonomy(id, level);
  };

  const handleUpdateParams = (id: AgentId, temp: number, safety: number) => {
    agentControlService.updateAgentParameters(id, temp, safety);
  };

  const handleExecuteCommand = async (prompt: string) => {
    setIsExecutingCommand(true);
    try {
      const response = await agentControlService.executeCommand(prompt);
      setLastCommandResponse(response);
      return response;
    } finally {
      setIsExecutingCommand(false);
    }
  };

  const handleTriggerMacroAction = async (actionType: string) => {
    setIsExecutingMacro(true);
    try {
      return await agentControlService.triggerMacroAction(actionType);
    } finally {
      setIsExecutingMacro(false);
    }
  };

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchFilter.toLowerCase()) ||
      agent.specialty.toLowerCase().includes(searchFilter.toLowerCase()) ||
      agent.codename.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Collect all thought logs across all agents for the telemetry tab
  const allThoughtLogs = agents
    .flatMap((a) => a.reasoningLogs)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#3B2418] text-[#FFF9F0] flex items-center justify-center border border-[#B88A52]/50 shadow-md">
              <Bot className="w-5 h-5 text-[#B88A52]" />
            </div>
            <div>
              <h1 className="text-2xl font-black font-display text-[#24150F] tracking-tight">
                AI Agent Control System
              </h1>
              <p className="text-xs text-[#5A3825]">
                Multi-Agent Autonomous Orchestration, AST Invariant Solvers, and Formal Proof Verification
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl glass-frame border border-[#DCC7AE]/80">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-[#3B2418] text-[#FFF9F0] shadow-sm'
                : 'text-[#5A3825] hover:text-[#24150F] hover:bg-white/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#B88A52]" />
            <span>Swarm & Units</span>
          </button>

          <button
            onClick={() => setActiveTab('dispatch')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'dispatch'
                ? 'bg-[#3B2418] text-[#FFF9F0] shadow-sm'
                : 'text-[#5A3825] hover:text-[#24150F] hover:bg-white/50'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-[#B88A52]" />
            <span>AI Dispatch</span>
          </button>

          <button
            onClick={() => setActiveTab('missions')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'missions'
                ? 'bg-[#3B2418] text-[#FFF9F0] shadow-sm'
                : 'text-[#5A3825] hover:text-[#24150F] hover:bg-white/50'
            }`}
          >
            <History className="w-3.5 h-3.5 text-[#B88A52]" />
            <span>Missions ({missions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'telemetry'
                ? 'bg-[#3B2418] text-[#FFF9F0] shadow-sm'
                : 'text-[#5A3825] hover:text-[#24150F] hover:bg-white/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-[#B88A52]" />
            <span>Neural Stream</span>
          </button>
        </div>
      </div>

      {/* Global Swarm Header Control Bar */}
      <SwarmHeaderControls
        swarmState={swarmState}
        onSetMode={handleSetMode}
        onToggleKillSwitch={handleToggleKillSwitch}
        onTriggerMacroAction={handleTriggerMacroAction}
        isExecutingMacro={isExecutingMacro}
      />

      {/* Tab: Swarm & Units View */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          {/* Swarm Neural Topology */}
          <SwarmTopologyMatrix
            agents={agents}
            selectedAgentId={selectedAgentId}
            onSelectAgent={(id) => setSelectedAgentId(id === selectedAgentId ? null : id)}
          />

          {/* Quick AI Command Prompt Strip */}
          <AgentCommandTerminal
            onExecuteCommand={handleExecuteCommand}
            isLoading={isExecutingCommand}
            lastResponse={lastCommandResponse}
          />

          {/* Agent Filter & Roster Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div>
              <h3 className="text-base font-bold font-display text-[#24150F]">
                Specialized Cyber Defense Agent Units ({filteredAgents.length})
              </h3>
              <p className="text-xs text-[#5A3825]">
                Tune autonomous reasoning thresholds, inspect thought streams, and supervise surgical patch pipelines
              </p>
            </div>

            {/* Filter Inputs */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#5A3825] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter agents..."
                  className="pl-8 pr-3 py-1.5 glass-input rounded-xl text-xs font-mono text-[#24150F] placeholder-[#5A3825]/60 outline-hidden w-36 sm:w-44"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 glass-input rounded-xl text-xs font-mono text-[#24150F] outline-hidden cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="ANALYZING">Analyzing</option>
                <option value="EXECUTING">Executing</option>
                <option value="VERIFYING">Verifying</option>
                <option value="ALERT">Alert</option>
                <option value="IDLE">Idle</option>
                <option value="PAUSED">Paused</option>
              </select>
            </div>
          </div>

          {/* Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                isSelected={selectedAgentId === agent.id}
                onSelect={(id) => setSelectedAgentId(id === selectedAgentId ? null : id)}
                onPause={handlePauseAgent}
                onResume={handleResumeAgent}
                onUpdateAutonomy={handleUpdateAutonomy}
                onUpdateParams={handleUpdateParams}
                onOpenReasoningModal={(ag) => setReasoningModalAgent(ag)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab: Full AI Dispatch Terminal */}
      {activeTab === 'dispatch' && (
        <div className="space-y-6">
          <AgentCommandTerminal
            onExecuteCommand={handleExecuteCommand}
            isLoading={isExecutingCommand}
            lastResponse={lastCommandResponse}
          />

          {/* Swarm Topology Reference */}
          <SwarmTopologyMatrix
            agents={agents}
            selectedAgentId={selectedAgentId}
            onSelectAgent={(id) => setSelectedAgentId(id === selectedAgentId ? null : id)}
          />
        </div>
      )}

      {/* Tab: Missions Log */}
      {activeTab === 'missions' && <AgentMissionsTab missions={missions} />}

      {/* Tab: Real-time Neural Stream / Inter-Agent IPC Log */}
      {activeTab === 'telemetry' && (
        <div className="glass-frame rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCC7AE]/60 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#3B2418] text-[#B88A52]">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold font-display text-[#24150F]">
                  Real-time Neural Bus & Invariant Reasoning Telemetry
                </h3>
                <p className="text-xs text-[#5A3825]">
                  Live streaming record of inter-agent IPC handoffs, formal SMT proofs, and AST mutations
                </p>
              </div>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 font-bold">
              LIVE STREAM ACTIVE
            </span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 font-mono text-xs">
            {allThoughtLogs.length === 0 ? (
              <div className="p-8 text-center text-gray-500 italic">No telemetry logs recorded yet.</div>
            ) : (
              allThoughtLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-[#24150F] text-[#FFF9F0] border border-[#5A3825] space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[10px] text-[#B88A52]">
                    <span className="font-bold">
                      [{log.type}] {log.agentName}
                    </span>
                    <span>{log.timestamp}</span>
                  </div>
                  <div className="font-bold text-[#FFF9F0] text-xs">{log.summary}</div>
                  <div className="text-[11px] text-[#DCC7AE] leading-relaxed">{log.detail}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Deep Agent Reasoning Modal */}
      <AgentReasoningModal
        agent={reasoningModalAgent}
        onClose={() => setReasoningModalAgent(null)}
      />
    </div>
  );
};
