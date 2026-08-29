import React, { useState, useEffect } from 'react';
import { 
  Dna, 
  ChevronLeft, 
  ShieldCheck, 
  Code2, 
  Globe2, 
  CheckCircle2, 
  FileText, 
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import { RiskBadge } from '../components/common/RiskBadge';
import { DataFlowVisualizer } from '../components/common/DataFlowVisualizer';
import { GenomeGraph } from '../components/common/GenomeGraph';
import { CodeViewer } from '../components/common/CodeViewer';
import { VulnerabilityGenome } from '../types';
import { genomeService } from '../services/genomeService';

interface GenomeDetailPageProps {
  genomeId: string;
  onNavigate: (route: string) => void;
}

export const GenomeDetailPage: React.FC<GenomeDetailPageProps> = ({ genomeId, onNavigate }) => {
  const [genome, setGenome] = useState<VulnerabilityGenome | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await genomeService.getGenomeById(genomeId);
        setGenome(data);
      } catch (err) {
        // fallback
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [genomeId]);

  if (loading || !genome) {
    return (
      <div className="text-center py-20 font-mono text-xs text-[#5A3825]">
        Loading invariant genome model...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('genomes')}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#5A3825] hover:text-[#24150F] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Genome Library</span>
        </button>

        <span className="text-xs font-mono text-emerald-700 font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Active Invariant Defense: {genome.occurrences} Neutralized
        </span>
      </div>

      {/* Hero Strip */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#FFFDF9] border-2 border-[#DCC7AE] shadow-md space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#3B2418] text-[#B88A52] flex items-center justify-center font-bold text-xs">
                <Dna className="w-4 h-4" />
              </div>
              <span className="font-mono text-sm font-bold text-[#24150F] px-2.5 py-0.5 rounded bg-[#F5EBDD] border border-[#DCC7AE]">
                {genome.id}
              </span>
              <span className="font-mono text-xs font-bold text-[#3B2418] px-2.5 py-0.5 rounded bg-[#B88A52]/20 border border-[#B88A52]/40">
                {genome.cwe}
              </span>
              <RiskBadge severity={genome.severity} size="md" />
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold font-display text-[#24150F] tracking-tight">
              {genome.title}
            </h1>
            <p className="text-xs text-[#5A3825] max-w-3xl leading-relaxed">
              {genome.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('scan')}
              className="px-4 py-2 rounded-xl bg-[#3B2418] hover:bg-[#5A3825] text-[#FFF9F0] text-xs font-bold font-mono uppercase tracking-wider transition-all shadow-sm"
            >
              Scan for this Invariant
            </button>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#F5EBDD]/50 border border-[#DCC7AE]/70 text-xs font-mono">
          <div>
            <div className="text-[10px] text-[#5A3825] uppercase font-bold">First Ingested</div>
            <div className="font-bold text-[#24150F] mt-0.5">{genome.firstSeen}</div>
          </div>
          <div>
            <div className="text-[10px] text-[#5A3825] uppercase font-bold">Total Neutralizations</div>
            <div className="font-bold text-emerald-700 mt-0.5">{genome.occurrences} instances</div>
          </div>
          <div>
            <div className="text-[10px] text-[#5A3825] uppercase font-bold">Languages Defended</div>
            <div className="font-bold text-[#24150F] mt-0.5">{genome.languages.length} Runtimes</div>
          </div>
          <div>
            <div className="text-[10px] text-[#5A3825] uppercase font-bold">Invariant Accuracy</div>
            <div className="font-bold text-emerald-700 mt-0.5">99.8% (0 False Positives)</div>
          </div>
        </div>
      </div>

      {/* Visual Invariant Data Flow */}
      {genome.dataFlow && (
        <DataFlowVisualizer
          source={genome.dataFlow.source}
          transformation={genome.dataFlow.transformation}
          sink={genome.dataFlow.sink}
          missingGuard={genome.dataFlow.missingGuard}
        />
      )}

      {/* Interactive Polyglot Node Graph */}
      <GenomeGraph
        genomeId={genome.id}
        languages={genome.languages}
        occurrences={genome.occurrences}
      />

      {/* Invariant Rule Tree-Sitter / AST Query Code Viewer */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#5A3825]">
            <Code2 className="w-4 h-4 text-[#B88A52]" />
            Universal AST Invariant Query Specification
          </div>
          <span className="text-[11px] font-mono text-[#5A3825]">
            Cross-procedural taint rule (LangGraph AST Engine)
          </span>
        </div>

        <CodeViewer
          code={genome.invariantRule}
          language="text"
          filename={`${genome.id}_INVARIANT_RULE.ast`}
        />
      </div>

      {/* Related Real-World CVEs */}
      {genome.relatedCves && genome.relatedCves.length > 0 && (
        <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#DCC7AE]/70 shadow-sm space-y-3">
          <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#5A3825]">
            Historically Mapped Real-World Exploits & CVEs:
          </h4>
          <div className="flex flex-wrap gap-2">
            {genome.relatedCves.map((cve) => (
              <span
                key={cve}
                className="px-3 py-1.5 rounded-xl bg-[#24150F] text-[#FFF9F0] font-mono text-xs font-bold border border-[#5A3825] flex items-center gap-1.5"
              >
                <span>{cve}</span>
                <span className="text-[10px] text-emerald-400 font-normal">● Invariant Shielded</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
