import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AgentCommandResponse } from '../../services/agentControlService';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Terminal, 
  Layers, 
  ShieldCheck,
  Zap,
  Flame,
  Wrench,
  Dna
} from 'lucide-react';

interface AgentCommandTerminalProps {
  onExecuteCommand: (prompt: string) => Promise<AgentCommandResponse>;
  isLoading: boolean;
  lastResponse: AgentCommandResponse | null;
}

export const AgentCommandTerminal: React.FC<AgentCommandTerminalProps> = ({
  onExecuteCommand,
  isLoading,
  lastResponse,
}) => {
  const [prompt, setPrompt] = useState('');
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const presets = [
    {
      label: 'Autonomous Triage & Patch',
      icon: <Wrench className="w-3.5 h-3.5 text-emerald-400" />,
      text: 'Scan UserSearchService.java for SQL injection AST invariants, synthesize parameterized rewrite, and verify with Veritas-Proof Z3 solver.',
    },
    {
      label: 'Adversarial War Game',
      icon: <Flame className="w-3.5 h-3.5 text-red-400" />,
      text: 'Mobilize Red-Storm to simulate 50,000 zero-day memory boundary mutations on native C++ packet parser.',
    },
    {
      label: 'Zero-Regression Sweep',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />,
      text: 'Deploy Chrono-Guard to inspect recent git commits and verify that no historical vulnerability invariants were reintroduced.',
    },
    {
      label: 'Genome Invariant Distillation',
      icon: <Dna className="w-3.5 h-3.5 text-amber-400" />,
      text: 'Have Genome-Curator digest recent CVE bulletins and compile new AST invariant rules into permanent memory.',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || typeof prompt !== 'string' || !prompt.trim() || isLoading) return;
    await onExecuteCommand(prompt.trim());
    setPrompt('');
  };

  const handleSelectPreset = (presetText: string) => {
    setPrompt(presetText);
    setActivePreset(presetText);
  };

  return (
    <div className="glass-frame rounded-2xl p-6 space-y-6 relative overflow-hidden">
      {/* Visual Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#B88A52]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCC7AE]/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#3B2418] text-[#FFF9F0] flex items-center justify-center shadow-md border border-[#B88A52]/40">
            <Bot className="w-5 h-5 text-[#B88A52]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold font-display text-[#24150F]">
                AI Swarm Commander Dispatch
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-500/20">
                GEMINI 3.7 FLASH READY
              </span>
            </div>
            <p className="text-xs text-[#5A3825]">
              Issue high-level natural language directives to orchestrate autonomous multi-agent cyber defense
            </p>
          </div>
        </div>
      </div>

      {/* Preset Directive Chips */}
      <div className="space-y-2">
        <div className="text-[11px] font-mono font-bold uppercase text-[#5A3825] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#B88A52]" />
          <span>Quick Autonomous Directives:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {presets.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelectPreset(p.text)}
              className="p-2.5 rounded-xl glass-pill hover:bg-white/90 text-left transition-all flex items-center gap-2 border border-[#DCC7AE]/70 hover:border-[#B88A52] cursor-pointer shadow-xs group"
            >
              <div className="p-1.5 rounded-lg bg-[#3B2418] shrink-0">{p.icon}</div>
              <span className="text-xs font-semibold text-[#24150F] group-hover:text-[#3B2418] truncate">
                {p.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Natural Language Command Input Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Command AI Swarm: e.g. 'Synthesize a zero-regression AST patch for CWE-89 in UserSearchService.java'..."
            disabled={isLoading}
            className="w-full pl-4 pr-32 py-3.5 glass-input rounded-2xl text-xs font-mono text-[#24150F] placeholder-[#5A3825]/60 outline-hidden shadow-inner"
          />
          <button
            type="submit"
            disabled={!prompt || typeof prompt !== 'string' || !prompt.trim() || isLoading}
            className="absolute right-2 px-4 py-2 rounded-xl bg-[#3B2418] hover:bg-[#5A3825] text-[#FFF9F0] text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-md"
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-[#B88A52] border-t-transparent rounded-full animate-spin" />
                <span>Reasoning...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 text-[#B88A52]" />
                <span>Dispatch</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Execution Feedback & Thought Stream Output */}
      <AnimatePresence>
        {lastResponse && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-[#24150F] text-[#FFF9F0] space-y-4 border border-[#5A3825] shadow-xl"
          >
            {/* Mission Overview Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#5A3825] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#3B2418] text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#FFF9F0] font-display">
                    {lastResponse.missionOutcome?.title || 'Autonomous Swarm Execution Complete'}
                  </h4>
                  <p className="text-xs text-[#DCC7AE]">{lastResponse.planSummary}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="px-2.5 py-1 rounded-md bg-[#3B2418] text-[#B88A52] font-bold border border-[#5A3825]">
                  AI Engine: {lastResponse.aiSource}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40">
                  Confidence: {lastResponse.missionOutcome?.confidenceScore || 99.6}%
                </span>
              </div>
            </div>

            {/* Directive Execution Steps */}
            {lastResponse.directiveSteps && lastResponse.directiveSteps.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-mono uppercase font-bold text-[#B88A52] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Agent Execution Pipeline:</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {lastResponse.directiveSteps.map((step) => (
                    <div
                      key={step.id}
                      className="p-3 rounded-xl bg-[#1C100B] border border-[#5A3825]/80 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#FFF9F0]">{step.stepName}</span>
                        <span className="text-[10px] font-mono text-[#B88A52] font-bold">
                          {step.agentName}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#DCC7AE] font-mono">{step.action}</div>
                      <div className="pt-1 text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{step.output}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Thought Stream Snippet */}
            {lastResponse.thoughtStream && lastResponse.thoughtStream.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-mono uppercase font-bold text-[#B88A52] flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Agent Chain-of-Thought Stream:</span>
                </div>
                <div className="space-y-1.5">
                  {lastResponse.thoughtStream.map((t, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-[#1C100B] border border-[#5A3825]/60 text-xs font-mono"
                    >
                      <div className="flex items-center justify-between text-[10px] text-[#B88A52] mb-1">
                        <span className="font-bold">
                          [{t.type}] {t.agentName}
                        </span>
                        <span className="text-gray-400">t={i * 2 + 1}s</span>
                      </div>
                      <div className="text-[#FFF9F0] font-semibold mb-0.5">{t.summary}</div>
                      <div className="text-[11px] text-[#DCC7AE] leading-relaxed">{t.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tactical Advice */}
            {lastResponse.tacticalAdvice && (
              <div className="p-3 rounded-xl bg-[#3B2418] border border-[#B88A52]/40 text-xs text-[#FFF9F0] flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#B88A52] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#B88A52]">Tactical AI Advice: </span>
                  <span className="text-[#DCC7AE]">{lastResponse.tacticalAdvice}</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
