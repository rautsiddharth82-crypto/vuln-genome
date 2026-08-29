import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Wrench, 
  ChevronRight, 
  Dna, 
  CheckCircle2, 
  AlertTriangle,
  FileCode
} from 'lucide-react';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { Vulnerability, SeverityLevel, VulnerabilityStatus } from '../types';
import { vulnerabilityService } from '../services/vulnerabilityService';
import { patchService } from '../services/patchService';
import { useToast } from '../context/ToastContext';

interface VulnerabilitiesPageProps {
  onNavigate: (route: string) => void;
}

export const VulnerabilitiesPage: React.FC<VulnerabilitiesPageProps> = ({ onNavigate }) => {
  const [vulns, setVulns] = useState<Vulnerability[]>([]);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const { success, info } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await vulnerabilityService.getVulnerabilities();
        setVulns(data);
      } catch (err) {
        // fallback
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handlePatch = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await patchService.generatePatch(id);
      success('Patch Synthesized', `CrewAI compiled secure AST diff for ${id}`);
      onNavigate(`vulnerabilities/${id}`);
    } catch (err: any) {
      // ignore
    }
  };

  const filtered = vulns.filter((v) => {
    const matchesSearch =
      v.id.toLowerCase().includes(search.toLowerCase()) ||
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.cwe.toLowerCase().includes(search.toLowerCase()) ||
      v.file.toLowerCase().includes(search.toLowerCase()) ||
      v.genomeId.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || v.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#B88A52]">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            Taint & Invariant Sink Inventory
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-[#24150F] tracking-tight mt-0.5">
            Vulnerabilities
          </h1>
          <p className="text-xs text-[#5A3825] mt-1">
            Confirmed code sinks matched against invariant AST vulnerability genomes.
          </p>
        </div>

        <button
          onClick={() => onNavigate('scan')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B2418] hover:bg-[#5A3825] text-[#FFF9F0] text-xs font-bold font-mono uppercase tracking-wider transition-all shadow-md"
        >
          <span>Run Security Ingestion</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#DCC7AE]/70 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A3825]/60" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, CWE, Genome, or file path..."
              className="w-full pl-9 pr-4 py-2 bg-[#F5EBDD]/50 border border-[#DCC7AE] rounded-xl text-xs font-mono text-[#24150F] outline-hidden focus:bg-white focus:border-[#B88A52]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="font-bold text-[#5A3825]">Severity:</span>
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  severityFilter === sev
                    ? 'bg-[#3B2418] text-[#FFF9F0]'
                    : 'bg-[#F5EBDD] text-[#5A3825] hover:bg-[#DCC7AE]'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono pt-2 border-t border-[#DCC7AE]/50">
          <span className="font-bold text-[#5A3825]">Lifecycle Status:</span>
          {['ALL', 'CONFIRMED', 'PATCHING', 'FIXED', 'VERIFIED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                statusFilter === st
                  ? 'bg-[#B88A52] text-[#24150F]'
                  : 'bg-[#F5EBDD]/60 text-[#5A3825] hover:bg-[#DCC7AE]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Vulnerabilities Table */}
      <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#DCC7AE]/70 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#DCC7AE]/80 text-[#5A3825] font-mono uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Severity</th>
                <th className="py-3 px-3">Identifier & Name</th>
                <th className="py-3 px-3">Genome Model</th>
                <th className="py-3 px-3">CWE Class</th>
                <th className="py-3 px-3">File & Sink</th>
                <th className="py-3 px-3">Confidence</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCC7AE]/40">
              {filtered.map((v) => (
                <tr
                  key={v.id}
                  onClick={() => onNavigate(`vulnerabilities/${v.id}`)}
                  className="hover:bg-[#F5EBDD]/50 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-3">
                    <RiskBadge severity={v.severity} size="sm" />
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-[#24150F]">
                    <div>{v.id}</div>
                    <div className="text-[11px] text-[#5A3825] font-normal font-sans truncate max-w-[200px]">
                      {v.title}
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-[#3B2418] text-[#FFF9F0] font-mono text-[11px] font-bold">
                      {v.genomeId}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[#3B2418]">
                    {v.cwe}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[#3B2418]">
                    <div className="truncate max-w-[200px]">{v.file}:{v.line}</div>
                    <div className="text-[10px] text-[#5A3825] uppercase">{v.language}</div>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-emerald-700">
                    {v.confidence}%
                  </td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={v.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onNavigate(`vulnerabilities/${v.id}`)}
                        className="px-2.5 py-1 rounded-lg bg-[#F5EBDD] hover:bg-[#DCC7AE] text-[#3B2418] text-xs font-bold font-mono transition-colors border border-[#DCC7AE]"
                      >
                        Inspect
                      </button>
                      {v.status !== 'FIXED' && v.status !== 'VERIFIED' && (
                        <button
                          onClick={(e) => handlePatch(v.id, e)}
                          className="px-2.5 py-1 rounded-lg bg-[#3B2418] hover:bg-[#5A3825] text-[#FFF9F0] text-xs font-bold font-mono transition-colors flex items-center gap-1"
                        >
                          <Wrench className="w-3 h-3 text-[#B88A52]" />
                          <span>Patch</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
