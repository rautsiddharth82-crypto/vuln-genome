import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Sparkles, Check, Copy } from 'lucide-react';

interface DiffViewerProps {
  beforeCode?: string;
  afterCode?: string;
  filename?: string;
  language?: string;
  className?: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  beforeCode = '',
  afterCode = '',
  filename,
  language = 'java',
  className = '',
}) => {
  const [copiedAfter, setCopiedAfter] = useState(false);

  const safeBefore = typeof beforeCode === 'string' ? beforeCode : '';
  const safeAfter = typeof afterCode === 'string' ? afterCode : '';

  const beforeLines = safeBefore.trim().split('\n');
  const afterLines = safeAfter.trim().split('\n');

  const handleCopyAfter = () => {
    navigator.clipboard.writeText(safeAfter);
    setCopiedAfter(true);
    setTimeout(() => setCopiedAfter(false), 2000);
  };

  return (
    <div className={`rounded-2xl border border-[#DCC7AE]/80 bg-[#FFFDF9] shadow-sm overflow-hidden ${className}`}>
      {/* Top action header */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-[#F5EBDD]/70 border-b border-[#DCC7AE]/70 gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#B88A52]/20 text-[#3B2418]">
            <Sparkles className="w-4 h-4 text-[#B88A52]" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#24150F] uppercase tracking-wider font-mono">
              AST Autonomous Diff Engine
            </div>
            {filename && <div className="text-[11px] text-[#5A3825]">{filename}</div>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-[#3B2418] text-[#FFF9F0] text-xs font-mono font-bold">
            {language.toUpperCase()}
          </span>
          <button
            onClick={handleCopyAfter}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3B2418] hover:bg-[#5A3825] text-[#FFF9F0] text-xs font-medium transition-colors shadow-sm"
          >
            {copiedAfter ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Patch Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#B88A52]" />
                <span>Copy Patched Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Side-by-side grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#DCC7AE]/70">
        {/* Left Side: BEFORE (Vulnerable) */}
        <div className="flex flex-col bg-[#24150F] text-[#F5EBDD] font-mono text-xs">
          <div className="px-4 py-2 bg-[#1C100B] border-b border-[#5A3825]/40 flex items-center justify-between text-[11px] font-semibold text-red-300">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              ORIGINAL (VULNERABLE STATE)
            </span>
            <span className="px-1.5 py-0.5 rounded bg-red-950/60 border border-red-500/30 text-red-300 text-[10px]">
              Active Exploit Sink
            </span>
          </div>
          <div className="p-3 overflow-x-auto max-h-[420px] select-text">
            <table className="w-full border-collapse">
              <tbody>
                {beforeLines.map((line, idx) => (
                  <tr key={idx} className="hover:bg-[#3B2418]/30">
                    <td className="w-8 pr-2 py-0.5 text-right text-[#5A3825] select-none text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="pl-3 py-0.5 whitespace-pre text-[#F5EBDD]/90">
                      {line}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: AFTER (Autonomous Secure Patch) */}
        <div className="flex flex-col bg-[#1A1813] text-[#F5EBDD] font-mono text-xs">
          <div className="px-4 py-2 bg-[#12110D] border-b border-[#B88A52]/30 flex items-center justify-between text-[11px] font-semibold text-emerald-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              AUTONOMOUS PATCH (GUARDED)
            </span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[10px]">
              Verified & Guarded
            </span>
          </div>
          <div className="p-3 overflow-x-auto max-h-[420px] select-text">
            <table className="w-full border-collapse">
              <tbody>
                {afterLines.map((line, idx) => (
                  <tr key={idx} className="hover:bg-emerald-950/20">
                    <td className="w-8 pr-2 py-0.5 text-right text-[#5A3825] select-none text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="pl-3 py-0.5 whitespace-pre text-[#F5EBDD]">
                      {line}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
