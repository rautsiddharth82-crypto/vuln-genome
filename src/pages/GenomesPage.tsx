import React, { useState, useEffect } from 'react';
import { 
  Dna, 
  Search, 
  PlusCircle, 
  Code2, 
  ShieldCheck, 
  ExternalLink, 
  ChevronRight, 
  ArrowRight,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';
import { RiskBadge } from '../components/common/RiskBadge';
import { VulnerabilityGenome } from '../types';
import { genomeService } from '../services/genomeService';
import { useToast } from '../context/ToastContext';

interface GenomesPageProps {
  onNavigate: (route: string) => void;
}

export const GenomesPage: React.FC<GenomesPageProps> = ({ onNavigate }) => {
  const [genomes, setGenomes] = useState<VulnerabilityGenome[]>([]);
  const [search, setSearch] = useState('');
  const [langFilter, setLangFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const { success } = useToast();

  // Add Genome Form state
  const [newId, setNewId] = useState('SSRF-v1');
  const [newCwe, setNewCwe] = useState('CWE-918');
  const [newTitle, setNewTitle] = useState('Server-Side Request Forgery Invariant');
  const [newDesc, setNewDesc] = useState('Enforces strict allowlist URL parsing before socket fetch.');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await genomeService.getGenomes();
        setGenomes(data);
      } catch (err) {
        // fallback
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleAddGenome = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await genomeService.createGenome({
        id: newId,
        cwe: newCwe,
        title: newTitle,
        description: newDesc,
        severity: 'HIGH',
        languages: ['python', 'javascript', 'go', 'java'],
        occurrences: 1,
        invariantRule: 'rule InvariantSSRF { strings: $url_fetch = "urllib.request" condition: $url_fetch and not valid_host }',
      });
      setGenomes(prev => [created, ...prev]);
      setShowAddModal(false);
      success('Genome Invariant Added', `Stored ${newId} in polyglot memory bank.`);
    } catch (err: any) {
      // ignore
    }
  };

  const filtered = genomes.filter((g) => {
    const matchesSearch =
      g.id.toLowerCase().includes(search.toLowerCase()) ||
      g.cwe.toLowerCase().includes(search.toLowerCase()) ||
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase());
    const matchesLang = langFilter === 'ALL' || g.languages.includes(langFilter.toLowerCase());
    return matchesSearch && matchesLang;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#B88A52]">
            <Dna className="w-4 h-4 text-[#B88A52]" />
            Universal Polyglot Invariant Bank
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-[#24150F] tracking-tight mt-0.5">
            Genome Library
          </h1>
          <p className="text-xs text-[#5A3825] mt-1">
            Structural AST patterns learned once and mapped universally across all programming languages.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B2418] hover:bg-[#5A3825] text-[#FFF9F0] text-xs font-bold font-mono uppercase tracking-wider transition-all shadow-md cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-[#B88A52]" />
          <span>Register New Genome</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#DCC7AE]/70 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A3825]/60" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Genome ID (SQLi-v1), CWE-89, or title..."
            className="w-full pl-9 pr-4 py-2 bg-[#F5EBDD]/50 border border-[#DCC7AE] rounded-xl text-xs font-mono text-[#24150F] outline-hidden focus:bg-white focus:border-[#B88A52]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="font-bold text-[#5A3825]">Language:</span>
          {['ALL', 'JAVA', 'PYTHON', 'CPP', 'JAVASCRIPT', 'GO', 'RUST'].map((lang) => (
            <button
              key={lang}
              onClick={() => setLangFilter(lang)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                langFilter === lang
                  ? 'bg-[#3B2418] text-[#FFF9F0]'
                  : 'bg-[#F5EBDD] text-[#5A3825] hover:bg-[#DCC7AE]'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Genome Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((genome) => (
          <div
            key={genome.id}
            onClick={() => onNavigate(`genomes/${genome.id}`)}
            className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#DCC7AE]/70 hover:border-[#B88A52] shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#3B2418] text-[#B88A52] flex items-center justify-center font-bold text-xs font-mono">
                    <Dna className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-mono font-bold text-[#24150F] group-hover:text-[#B88A52] transition-colors">
                      {genome.id}
                    </span>
                    <span className="text-[10px] font-mono text-[#5A3825] block">{genome.cwe}</span>
                  </div>
                </div>
                <RiskBadge severity={genome.severity} size="sm" />
              </div>

              <h3 className="text-base font-bold font-display text-[#24150F] line-clamp-1">
                {genome.title}
              </h3>
              <p className="text-xs text-[#5A3825] mt-1 line-clamp-2 leading-relaxed">
                {genome.description}
              </p>
            </div>

            {/* Languages and Defenses Footer */}
            <div className="pt-3 border-t border-[#DCC7AE]/50 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-1">
                {genome.languages.map((l) => (
                  <span
                    key={l}
                    className="px-1.5 py-0.5 rounded bg-[#F5EBDD] text-[#3B2418] text-[9px] uppercase font-bold border border-[#DCC7AE]"
                  >
                    {l}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{genome.occurrences} Defended</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Genome Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#FFFDF9] border border-[#DCC7AE] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCC7AE]/60 pb-3">
              <div className="flex items-center gap-2">
                <Dna className="w-5 h-5 text-[#B88A52]" />
                <h3 className="text-base font-bold font-display text-[#24150F]">
                  Register Vulnerability Genome
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#5A3825] hover:text-[#24150F]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddGenome} className="space-y-3 text-xs">
              <div>
                <label className="block font-mono font-bold text-[#3B2418] uppercase mb-1">
                  Genome Identifier (e.g. SSRF-v1)
                </label>
                <input
                  type="text"
                  required
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F5EBDD]/50 border border-[#DCC7AE] rounded-xl font-mono text-[#24150F]"
                />
              </div>

              <div>
                <label className="block font-mono font-bold text-[#3B2418] uppercase mb-1">
                  CWE Class (e.g. CWE-918)
                </label>
                <input
                  type="text"
                  required
                  value={newCwe}
                  onChange={(e) => setNewCwe(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F5EBDD]/50 border border-[#DCC7AE] rounded-xl font-mono text-[#24150F]"
                />
              </div>

              <div>
                <label className="block font-mono font-bold text-[#3B2418] uppercase mb-1">
                  Vulnerability Invariant Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F5EBDD]/50 border border-[#DCC7AE] rounded-xl text-[#24150F]"
                />
              </div>

              <div>
                <label className="block font-mono font-bold text-[#3B2418] uppercase mb-1">
                  Invariant Description & Guard Pattern
                </label>
                <textarea
                  rows={3}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F5EBDD]/50 border border-[#DCC7AE] rounded-xl text-[#24150F]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#DCC7AE]/60">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-[#5A3825] hover:bg-[#F5EBDD] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#3B2418] text-[#FFF9F0] font-bold font-mono uppercase tracking-wider"
                >
                  Register Invariant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
