import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Eye, 
  CheckCircle2, 
  Layers, 
  Calendar,
  ChevronRight
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { ScanJob } from '../types';
import { scanService } from '../services/scanService';
import { useToast } from '../context/ToastContext';

interface ScanHistoryPageProps {
  onNavigate: (route: string) => void;
}

export const ScanHistoryPage: React.FC<ScanHistoryPageProps> = ({ onNavigate }) => {
  const [scans, setScans] = useState<ScanJob[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const { success, info } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await scanService.getScanHistory();
        setScans(data);
      } catch (err) {
        // fallback
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = scans.filter((s) => {
    const matchesSearch =
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.target.toLowerCase().includes(search.toLowerCase()) ||
      s.branch.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDownload = (scan: ScanJob, e: React.MouseEvent) => {
    e.stopPropagation();
    const dataStr = JSON.stringify(scan, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SCAN_${scan.id}_REPORT.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    success('Scan Report Exported', `Saved SCAN_${scan.id}_REPORT.json`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#B88A52]">
            <History className="w-4 h-4 text-[#B88A52]" />
            Security Audit Trail
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-[#24150F] tracking-tight mt-0.5">
            Scan History
          </h1>
          <p className="text-xs text-[#5A3825] mt-1">
            Historical logs of all autonomous scans, AST ingestions, and verification runs.
          </p>
        </div>

        <button
          onClick={() => onNavigate('scan')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B2418] hover:bg-[#5A3825] text-[#FFF9F0] text-xs font-bold font-mono uppercase tracking-wider transition-all shadow-md"
        >
          <span>New Security Scan</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#DCC7AE]/70 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A3825]/60" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by Scan ID, repo, branch..."
              className="w-full pl-9 pr-4 py-2 bg-[#F5EBDD]/50 border border-[#DCC7AE] rounded-xl text-xs font-mono text-[#24150F] outline-hidden focus:bg-white focus:border-[#B88A52]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#5A3825]">Status:</span>
          {['ALL', 'COMPLETED', 'RUNNING', 'FAILED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-colors ${
                statusFilter === st
                  ? 'bg-[#3B2418] text-[#FFF9F0]'
                  : 'bg-[#F5EBDD] text-[#5A3825] hover:bg-[#DCC7AE]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Scans Table */}
      <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#DCC7AE]/70 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#DCC7AE]/80 text-[#5A3825] font-mono uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Scan Identifier</th>
                <th className="py-3 px-3">Target & Branch</th>
                <th className="py-3 px-3">Files / Lines</th>
                <th className="py-3 px-3">Vulnerabilities</th>
                <th className="py-3 px-3">Security Score</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCC7AE]/40">
              {filtered.map((scan) => {
                const fixedCount = scan.breakdown?.fixed ?? scan.fixedCount ?? scan.vulnerabilities?.filter((v) => v.status === 'FIXED' || v.status === 'VERIFIED').length ?? 0;
                const targetName = scan.target || scan.repository || 'Uploaded Archive';

                return (
                  <tr
                    key={scan.id}
                    onClick={() => onNavigate(`scans/${scan.id}`)}
                    className="hover:bg-[#F5EBDD]/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-3 font-mono font-bold text-[#24150F]">
                      {scan.id}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[#3B2418]">
                      <div className="font-bold truncate max-w-[200px]">{targetName}</div>
                      <div className="text-[10px] text-[#5A3825]">{scan.branch}</div>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[#3B2418]">
                      <div>{scan.filesCount} files</div>
                      <div className="text-[10px] text-[#5A3825]">{scan.linesAnalyzed.toLocaleString()} lines</div>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold">
                      <span className="text-amber-700">{scan.vulnerabilitiesFound} found</span>
                      <span className="text-xs text-emerald-700 block">({fixedCount} fixed)</span>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-emerald-700">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-300">
                        {scan.securityScore}%
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={scan.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[#5A3825] text-[11px]">
                      {scan.startedAt}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onNavigate(`scans/${scan.id}`)}
                          className="px-2.5 py-1 rounded-lg bg-[#3B2418] hover:bg-[#5A3825] text-[#FFF9F0] text-xs font-mono font-bold transition-colors"
                        >
                          Results
                        </button>
                        <button
                          onClick={(e) => handleDownload(scan, e)}
                          className="p-1 rounded-lg bg-[#F5EBDD] hover:bg-[#DCC7AE] text-[#3B2418] border border-[#DCC7AE]"
                          title="Download JSON Report"
                        >
                          <Download className="w-3.5 h-3.5 text-[#B88A52]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs font-mono text-[#5A3825]">
                    No scans found matching your search filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
