import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Dna, ShieldCheck, Code2, Globe2 } from 'lucide-react';

interface GenomeGraphProps {
  genomeId: string;
  languages: string[];
  occurrences: number;
  className?: string;
}

export const GenomeGraph: React.FC<GenomeGraphProps> = ({
  genomeId,
  languages,
  occurrences,
  className = '',
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const langMetadata: Record<string, { label: string; framework: string; pattern: string; color: string }> = {
    java: { label: 'Java', framework: 'JDBC / Spring Data', pattern: 'PreparedStatement placeholder (?)', color: '#EA580C' },
    python: { label: 'Python', framework: 'SQLAlchemy / DB-API', pattern: 'Parameter tuple binding %s / :param', color: '#3B82F6' },
    javascript: { label: 'JavaScript / Node', framework: 'pg / Prisma / TypeORM', pattern: 'Parameterized tagged template ($1)', color: '#F59E0B' },
    cpp: { label: 'C++', framework: 'libpqxx / SQLite3', pattern: 'sqlite3_bind_text() parameter', color: '#8B5CF6' },
    go: { label: 'Go', framework: 'database/sql', pattern: 'db.Query(query, args...)', color: '#06B6D4' },
    rust: { label: 'Rust', framework: 'sqlx / Diesel', pattern: 'sqlx::query! positional bindings', color: '#EF4444' },
  };

  const centerNode = { id: genomeId, label: genomeId, type: 'genome' };

  return (
    <div className={`p-6 rounded-2xl bg-[#FFFDF9] border border-[#DCC7AE]/70 shadow-sm ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold font-mono text-[#5A3825] uppercase tracking-wider">
            <Dna className="w-4 h-4 text-[#B88A52]" />
            Universal AST Polyglot Mapping
          </div>
          <p className="text-xs text-[#5A3825]/90 mt-0.5">
            Single invariant schema protecting across {languages.length} programming runtimes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#B88A52]/15 text-[#3B2418] border border-[#B88A52]/40 text-xs font-mono font-bold">
            {occurrences} Defenses Recorded
          </span>
        </div>
      </div>

      {/* Visual node layout */}
      <div className="relative py-8 px-4 flex flex-col md:flex-row items-center justify-center gap-6 bg-[#F5EBDD]/40 rounded-xl border border-[#DCC7AE]/50">
        {/* Center Genome Node */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative z-10 p-5 rounded-2xl bg-[#3B2418] text-[#FFF9F0] border-2 border-[#B88A52] shadow-xl flex flex-col items-center justify-center text-center cursor-pointer min-w-[180px]"
          onClick={() => setSelectedNode(null)}
        >
          <div className="w-10 h-10 rounded-full bg-[#B88A52]/30 flex items-center justify-center mb-2">
            <Dna className="w-5 h-5 text-[#B88A52]" />
          </div>
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#B88A52]">
            GENOME ROOT
          </span>
          <span className="text-lg font-bold font-display mt-0.5">{genomeId}</span>
          <span className="text-[11px] text-[#DCC7AE] mt-1">Cross-Language Invariant</span>
        </motion.div>

        {/* Orbiting Language Nodes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto">
          {languages.map((lang) => {
            const meta = langMetadata[lang] || {
              label: lang.toUpperCase(),
              framework: 'Standard Library',
              pattern: 'Positional Safe Binding',
              color: '#B88A52',
            };
            const isSelected = selectedNode === lang;

            return (
              <motion.div
                key={lang}
                whileHover={{ scale: 1.03 }}
                onClick={() => setSelectedNode(isSelected ? null : lang)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#3B2418] text-[#FFF9F0] border-[#B88A52] shadow-md'
                    : 'bg-[#FFFDF9] text-[#24150F] border-[#DCC7AE] hover:border-[#B88A52]/70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <Code2 className="w-3.5 h-3.5 text-[#B88A52]" />
                    <span>{meta.label}</span>
                  </div>
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: meta.color }}
                  />
                </div>
                <div className="text-[11px] font-mono truncate text-[#5A3825] group-hover:text-[#FFF9F0]">
                  {meta.framework}
                </div>
                <div className="mt-2 pt-2 border-t border-black/5 text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Invariant Mapped</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Selected language inspector */}
      {selectedNode && langMetadata[selectedNode] && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-xl bg-[#24150F] text-[#F5EBDD] font-mono text-xs border border-[#5A3825]"
        >
          <div className="flex items-center justify-between text-xs text-[#B88A52] font-bold mb-2">
            <span>Runtime Protection Hook: {langMetadata[selectedNode].label}</span>
            <span className="text-[11px] text-[#DCC7AE]">CWE AST Pattern</span>
          </div>
          <p className="text-[#DCC7AE]">
            Framework: <span className="text-white">{langMetadata[selectedNode].framework}</span>
          </p>
          <p className="text-[#DCC7AE] mt-1">
            Synthesized Guard Rule: <code className="text-emerald-400">{langMetadata[selectedNode].pattern}</code>
          </p>
        </motion.div>
      )}
    </div>
  );
};
