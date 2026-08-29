import React, { useState } from 'react';
import { Copy, Check, FileCode, Terminal } from 'lucide-react';

interface CodeViewerProps {
  code?: string;
  language?: string;
  filename?: string;
  highlightLine?: number;
  highlightEndLine?: number;
  highlightLines?: number[];
  readOnly?: boolean;
  className?: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  code = '',
  language = 'text',
  filename,
  highlightLine,
  highlightEndLine,
  highlightLines,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const safeCode = typeof code === 'string' ? code : '';
  const lines = safeCode.trim().split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(safeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-xl overflow-hidden border border-[#5A3825]/40 bg-[#24150F] text-[#F5EBDD] font-mono text-xs shadow-lg ${className}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1C100B] border-b border-[#5A3825]/30">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70 inline-block" />
          </div>
          {filename ? (
            <span className="flex items-center gap-1.5 text-xs text-[#DCC7AE] font-semibold">
              <FileCode className="w-3.5 h-3.5 text-[#B88A52]" />
              {filename}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-[#DCC7AE] font-semibold">
              <Terminal className="w-3.5 h-3.5 text-[#B88A52]" />
              Source Inspection
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-[#3B2418] text-[#DCC7AE] text-[10px] uppercase font-bold tracking-wider">
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded bg-[#3B2418] hover:bg-[#5A3825] text-[#DCC7AE] text-xs transition-colors"
            title="Copy Code"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 text-[11px]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span className="text-[11px]">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code contents with line numbers */}
      <div className="p-3 overflow-x-auto max-h-[480px] leading-relaxed select-text">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((lineContent, index) => {
              const lineNumber = index + 1;
              const isHighlighted =
                (highlightLine !== undefined &&
                  lineNumber >= highlightLine &&
                  lineNumber <= (highlightEndLine || highlightLine)) ||
                (highlightLines && highlightLines.includes(lineNumber));

              return (
                <tr
                  key={lineNumber}
                  className={`${
                    isHighlighted
                      ? 'bg-red-950/40 border-l-2 border-red-500 text-red-100 font-semibold'
                      : 'hover:bg-[#3B2418]/20'
                  }`}
                >
                  <td className="w-10 pr-3 py-0.5 text-right text-[#5A3825] select-none font-mono text-[11px]">
                    {lineNumber}
                  </td>
                  <td className="pl-3 py-0.5 font-mono whitespace-pre text-[#F5EBDD]/90">
                    {lineContent}
                    {isHighlighted && (
                      <span className="ml-3 text-[10px] uppercase tracking-wider text-red-400 bg-red-900/50 px-1.5 py-0.5 rounded border border-red-500/30 select-none">
                        VULNERABLE SINK
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
