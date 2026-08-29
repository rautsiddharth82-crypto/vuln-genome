import React, { useRef, useEffect } from 'react';
import { TerminalLog } from '../../types';
import { Terminal, Shield, CheckCircle2, AlertTriangle, XCircle, Dna } from 'lucide-react';

interface TerminalConsoleProps {
  logs: TerminalLog[];
  title?: string;
  className?: string;
  isLive?: boolean;
}

export const TerminalConsole: React.FC<TerminalConsoleProps> = ({
  logs,
  title = 'Autonomous Security Analysis Console',
  className = '',
  isLive = true,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLevelStyle = (level: TerminalLog['level']) => {
    switch (level) {
      case 'GENOME':
        return { text: 'text-[#B88A52]', badge: 'bg-[#B88A52]/20 text-[#B88A52] border-[#B88A52]/40', icon: <Dna className="w-3 h-3 text-[#B88A52]" /> };
      case 'SUCCESS':
        return { text: 'text-emerald-400', badge: 'bg-emerald-950/50 text-emerald-400 border-emerald-500/30', icon: <CheckCircle2 className="w-3 h-3 text-emerald-400" /> };
      case 'WARN':
        return { text: 'text-amber-300', badge: 'bg-amber-950/50 text-amber-300 border-amber-500/30', icon: <AlertTriangle className="w-3 h-3 text-amber-400" /> };
      case 'ERROR':
        return { text: 'text-red-400', badge: 'bg-red-950/50 text-red-400 border-red-500/30', icon: <XCircle className="w-3 h-3 text-red-400" /> };
      default:
        return { text: 'text-[#F5EBDD]/90', badge: 'bg-[#3B2418] text-[#DCC7AE] border-[#5A3825]', icon: <Shield className="w-3 h-3 text-[#DCC7AE]" /> };
    }
  };

  return (
    <div className={`rounded-2xl border border-[#5A3825]/50 bg-[#1C100B] text-[#F5EBDD] font-mono text-xs shadow-xl overflow-hidden flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#140B07] border-b border-[#5A3825]/40">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70 inline-block" />
          </div>
          <Terminal className="w-4 h-4 text-[#B88A52]" />
          <span className="font-semibold text-xs tracking-wider text-[#DCC7AE]">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isLive && (
            <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 uppercase tracking-widest font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              LIVE TELEMETRY
            </span>
          )}
          <span className="text-[10px] text-[#5A3825] px-2 py-0.5 rounded bg-[#24150F] border border-[#5A3825]/30">
            TTY: 09/DOD
          </span>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div
        ref={scrollRef}
        className="p-4 space-y-2 overflow-y-auto max-h-[360px] min-h-[220px] select-text scroll-smooth"
      >
        {logs.map((log, idx) => {
          const style = getLevelStyle(log.level);
          return (
            <div key={idx} className="flex items-start gap-2.5 leading-relaxed hover:bg-white/5 p-1 rounded transition-colors">
              <span className="text-[#5A3825] shrink-0 text-[11px]">
                [{log.timestamp}]
              </span>
              <span className={`px-1.5 py-0.2 rounded border text-[9px] uppercase font-bold shrink-0 flex items-center gap-1 ${style.badge}`}>
                {style.icon}
                <span>{log.level}</span>
              </span>
              <span className={`break-all ${style.text}`}>
                {log.message}
              </span>
            </div>
          );
        })}
        {logs.length === 0 && (
          <div className="text-center py-10 text-[#5A3825]">
            Awaiting telemetry pipeline connection...
          </div>
        )}
      </div>

      {/* Prompt footer */}
      <div className="px-4 py-2 bg-[#140B07] border-t border-[#5A3825]/30 flex items-center justify-between text-[11px] text-[#5A3825]">
        <div className="flex items-center gap-2">
          <span className="text-[#B88A52] font-bold">vg-agent@kernel:~$</span>
          <span className="w-2 h-4 bg-[#B88A52] inline-block animate-pulse" />
        </div>
        <span className="text-[10px] uppercase tracking-wider text-[#5A3825]">
          Air-Gapped LangGraph Orchestrator
        </span>
      </div>
    </div>
  );
};
