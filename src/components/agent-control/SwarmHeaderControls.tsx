import React from 'react';
import { SwarmControlState, SwarmMode } from '../../types';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Flame, 
  Lock, 
  Power, 
  Sparkles, 
  Activity, 
  Radio, 
  Cpu, 
  Database,
  RefreshCw
} from 'lucide-react';

interface SwarmHeaderControlsProps {
  swarmState: SwarmControlState;
  onSetMode: (mode: SwarmMode) => void;
  onToggleKillSwitch: () => void;
  onTriggerMacroAction: (actionType: string) => Promise<boolean>;
  isExecutingMacro: boolean;
}

export const SwarmHeaderControls: React.FC<SwarmHeaderControlsProps> = ({
  swarmState,
  onSetMode,
  onToggleKillSwitch,
  onTriggerMacroAction,
  isExecutingMacro,
}) => {
  const modes: { id: SwarmMode; label: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'AUTONOMOUS',
      label: 'Full Auto Defense',
      icon: <Radio className="w-3.5 h-3.5" />,
      color: 'bg-emerald-600 text-white',
    },
    {
      id: 'HUMAN_SUPERVISED',
      label: 'Supervised Gating',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
      color: 'bg-amber-600 text-white',
    },
    {
      id: 'WAR_GAME_SIMULATION',
      label: 'War Game Sim',
      icon: <Flame className="w-3.5 h-3.5" />,
      color: 'bg-red-600 text-white',
    },
    {
      id: 'AIR_GAPPED_FORTRESS',
      label: 'Air-Gapped Fortress',
      icon: <Lock className="w-3.5 h-3.5" />,
      color: 'bg-purple-600 text-white',
    },
  ];

  return (
    <div className="glass-frame rounded-2xl p-5 space-y-4">
      {/* Top Row: Operational Mode Selector + Emergency Kill Switch */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-[#DCC7AE]/60 pb-4">
        {/* Left: Swarm Mode Selector */}
        <div className="space-y-1.5 w-full lg:w-auto">
          <div className="text-[11px] font-mono uppercase font-bold text-[#5A3825] flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#B88A52]" />
            <span>Swarm Autonomous Operational Mode:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {modes.map((m) => {
              const isActive = swarmState.mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onSetMode(m.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                    isActive
                      ? `${m.color} shadow-md ring-2 ring-[#B88A52]/40`
                      : 'glass-pill hover:bg-white text-[#24150F] border-[#DCC7AE]/70'
                  }`}
                >
                  {m.icon}
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Emergency Kill Switch */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          <button
            onClick={onToggleKillSwitch}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md ${
              swarmState.globalKillSwitch
                ? 'bg-red-600 hover:bg-red-700 text-white ring-4 ring-red-300 animate-pulse'
                : 'bg-[#3B2418] hover:bg-[#5A3825] text-[#FFF9F0]'
            }`}
          >
            <Power className="w-4 h-4 text-[#B88A52]" />
            <span>
              {swarmState.globalKillSwitch ? 'DISENGAGE LOCKDOWN' : 'EMERGENCY SWARM HALT'}
            </span>
          </button>
        </div>
      </div>

      {/* Middle Row: Real-time Macro Swarm Telemetry KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl glass-pill flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#3B2418] text-emerald-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono font-bold text-[#5A3825]">Swarm Health</div>
            <div className="text-sm font-bold font-mono text-[#24150F]">{swarmState.swarmHealth}% NOMINAL</div>
          </div>
        </div>

        <div className="p-3 rounded-xl glass-pill flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#3B2418] text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono font-bold text-[#5A3825]">AST Nodes Parsed</div>
            <div className="text-sm font-bold font-mono text-[#24150F]">
              {swarmState.totalAstNodesProcessed.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl glass-pill flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#3B2418] text-[#B88A52]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono font-bold text-[#5A3825]">Threats Intercepted</div>
            <div className="text-sm font-bold font-mono text-emerald-800 font-bold">
              {swarmState.threatsNeutralized} Sealed
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl glass-pill flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#3B2418] text-purple-400">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono font-bold text-[#5A3825]">Target Repository</div>
            <div className="text-xs font-bold font-mono text-[#24150F] truncate max-w-[120px]">
              {swarmState.targetRepository}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Swarm Macro Fast Action Triggers */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="text-[11px] font-mono font-bold text-[#5A3825] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#B88A52]" />
          <span>Swarm Workflows:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onTriggerMacroAction('INVARIANT_SWEEP')}
            disabled={isExecutingMacro || swarmState.globalKillSwitch}
            className="px-3 py-1.5 rounded-lg bg-white/70 hover:bg-white text-xs font-mono font-semibold text-[#24150F] border border-[#DCC7AE] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 text-[#B88A52] ${isExecutingMacro ? 'animate-spin' : ''}`} />
            <span>Trigger Invariant Sweep</span>
          </button>

          <button
            onClick={() => onTriggerMacroAction('WAR_GAME_SIM')}
            disabled={isExecutingMacro || swarmState.globalKillSwitch}
            className="px-3 py-1.5 rounded-lg bg-white/70 hover:bg-white text-xs font-mono font-semibold text-[#24150F] border border-[#DCC7AE] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Flame className="w-3 h-3 text-red-500" />
            <span>Run War Game Sim</span>
          </button>

          <button
            onClick={() => onTriggerMacroAction('AUTO_PATCH_ALL')}
            disabled={isExecutingMacro || swarmState.globalKillSwitch}
            className="px-3 py-1.5 rounded-lg bg-white/70 hover:bg-white text-xs font-mono font-semibold text-[#24150F] border border-[#DCC7AE] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Auto-Patch All Invariants</span>
          </button>
        </div>
      </div>
    </div>
  );
};
