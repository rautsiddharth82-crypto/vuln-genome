import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ShieldAlert, 
  FileCode, 
  ArrowRight, 
  Download, 
  RefreshCw, 
  Wrench, 
  Dna, 
  AlertTriangle, 
  Clock, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { ScanJob, Vulnerability } from '../types';
import { scanService } from '../services/scanService';
import { vulnerabilityService } from '../services/vulnerabilityService';
import { patchService } from '../services/patchService';
import { useToast } from '../context/ToastContext';

interface ScanResultsPageProps {
  scanId: string;
  onNavigate: (route: string) => void;
}

export const ScanResultsPage: React.FC<ScanResultsPageProps> = ({ scanId, onNavigate }) => {
  const [scan, setScan] = useState<ScanJob | null>(null);
  const [vulns, setVulns] = useState<Vulnerability[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, info } = useToast();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const foundScan = await scanService.getScanById(scanId);
        setScan(foundScan);
        const allVulns = await vulnerabilityService.getVulnerabilities();
        setVulns(allVulns);
      } catch (err) {
        // fallback
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [scanId]);

  const handleBatchPatch = async () => {
    info('Synthesizing Patches', 'Autonomous CrewAI agents compiling formal invariants...');
    for (const v of vulns) {
      if (v.status !== 'FIXED' && v.status !== 'VERIFIED') {
        await patchService.generatePatch(v.id);
      }
    }
    const updated = await vulnerabilityService.getVulnerabilities();
    setVulns(updated);
    success('Batch Patches Ready', 'Invariant AST patches synthesized for all candidate sinks.');
  };

  const handleExportJson = () => {
    const reportData = { scan, vulnerabilities: vulns };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VULN_GENOME_REPORT_${scanId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    success('Report Exported', `Saved VULN_GENOME_REPORT_${scanId}.json`);
  };

  if (loading || !scan) {
    return (
      <div className="text-center py-20 text-xs font-mono text-[#5A3825]">
        Loading scan telemetry and AST graph...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      {(() => {
        const breakdown = scan.breakdown || {
          critical: scan.criticalCount ?? scan.vulnerabilities?.filter((v) => v.severity === 'CRITICAL').length ?? 0,
          high: scan.highCount ?? scan.vulnerabilities?.filter((v) => v.severity === 'HIGH').length ?? 0,
          medium: scan.mediumCount ?? scan.vulnerabilities?.filter((v) => v.severity === 'MEDIUM').length ?? 0,
          low: scan.lowCount ?? scan.vulnerabilities?.filter((v) => v.severity === 'LOW').length ?? 0,
          fixed: scan.fixedCount ?? scan.vulnerabilities?.filter((v) => v.status === 'FIXED' || v.status === 'VERIFIED').length ?? 0,
        };
        const targetName = scan.target || scan.repository || 'Uploaded Source Code';
        const totalVulns = scan.vulnerabilitiesFound || scan.vulnerabilities?.length || 0;

        return (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#B88A52]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Scan Report Telemetry Completed
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold font-display text-[#24150F] tracking-tight mt-0.5">
                  Results: {targetName}
                </h1>
                <p className="text-xs text-[#5A3825] mt-1 font-mono">
                  Scan ID: {scan.id} • Target Branch: {scan.branch} • Executed: {scan.startedAt}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleExportJson}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F5EBDD] hover:bg-[#DCC7AE] text-[#3B2418] text-xs font-bold font-mono transition-colors border border-[#DCC7AE]"
                >
                  <Download className="w-4 h-4 text-[#B88A52]" />
                  <span>Export JSON Report</span>
                </button>

                <button
                  onClick={handleBatchPatch}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3B2418] hover:bg-[#5A3825] text-[#FFF9F0] text-xs font-bold font-mono transition-all shadow-sm"
                >
                  <Wrench className="w-4 h-4 text-[#B88A52]" />
                  <span>Synthesize All Patches</span>
                </button>
              </div>
            </div>

            {/* Summary KPI Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#DCC7AE]/70 shadow-xs">
                <div className="text-[10px] uppercase font-mono font-bold text-[#5A3825]">Security Score</div>
                <div className="text-2xl font-extrabold font-display text-emerald-700 mt-1">{scan.securityScore}%</div>
                <div className="text-[10px] text-[#5A3825]">System Hardening</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#DCC7AE]/70 shadow-xs">
                <div className="text-[10px] uppercase font-mono font-bold text-[#5A3825]">Vulnerabilities</div>
                <div className="text-2xl font-extrabold font-display text-[#24150F] mt-1">{totalVulns}</div>
                <div className="text-[10px] text-amber-700 font-semibold">{breakdown.critical} Critical</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#DCC7AE]/70 shadow-xs">
                <div className="text-[10px] uppercase font-mono font-bold text-[#5A3825]">Files Scanned</div>
                <div className="text-2xl font-extrabold font-display text-[#24150F] mt-1">{scan.filesCount}</div>
                <div className="text-[10px] text-[#5A3825] font-mono">AST units mapped</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#DCC7AE]/70 shadow-xs">
                <div className="text-[10px] uppercase font-mono font-bold text-[#5A3825]">Lines Analyzed</div>
                <div className="text-2xl font-extrabold font-display text-[#24150F] mt-1">{scan.linesAnalyzed.toLocaleString()}</div>
                <div className="text-[10px] text-[#5A3825]">Taint paths analyzed</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#DCC7AE]/70 shadow-xs">
                <div className="text-[10px] uppercase font-mono font-bold text-[#5A3825]">Scan Duration</div>
                <div className="text-2xl font-extrabold font-display text-[#24150F] mt-1">{scan.durationSeconds}s</div>
                <div className="text-[10px] text-[#5A3825]">Parallel AST Workers</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#DCC7AE]/70 shadow-xs">
                <div className="text-[10px] uppercase font-mono font-bold text-[#5A3825]">Fixed In Pipeline</div>
                <div className="text-2xl font-extrabold font-display text-emerald-700 mt-1">{breakdown.fixed}</div>
                <div className="text-[10px] text-emerald-800 font-semibold">Proof verified</div>
              </div>
            </div>

            {/* Breakdown Bar */}
            <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#DCC7AE]/70 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-[#5A3825]">
                <span>VULNERABILITY SEVERITY DISTRIBUTION</span>
                <span>{totalVulns} TOTAL DETECTIONS</span>
              </div>
              <div className="w-full h-3 bg-[#DCC7AE]/30 rounded-full overflow-hidden flex">
                <div style={{ width: totalVulns > 0 ? `${(breakdown.critical / totalVulns) * 100}%` : '0%' }} className="bg-red-600 h-full" title="Critical" />
                <div style={{ width: totalVulns > 0 ? `${(breakdown.high / totalVulns) * 100}%` : '0%' }} className="bg-amber-600 h-full" title="High" />
                <div style={{ width: totalVulns > 0 ? `${(breakdown.medium / totalVulns) * 100}%` : '0%' }} className="bg-yellow-500 h-full" title="Medium" />
                <div style={{ width: totalVulns > 0 ? `${(breakdown.low / totalVulns) * 100}%` : '0%' }} className="bg-blue-600 h-full" title="Low" />
              </div>
              <div className="flex flex-wrap gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-red-700 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-red-600" /> Critical: {breakdown.critical}</span>
                <span className="flex items-center gap-1.5 text-amber-700 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-amber-600" /> High: {breakdown.high}</span>
                <span className="flex items-center gap-1.5 text-yellow-800 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> Medium: {breakdown.medium}</span>
                <span className="flex items-center gap-1.5 text-blue-800 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Low: {breakdown.low}</span>
              </div>
            </div>
          </>
        );
      })()}

      {/* Detections Data Table */}
      <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#DCC7AE]/70 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-display text-[#24150F]">
            Detected Invariant Vulnerabilities
          </h3>
          <span className="text-xs font-mono text-[#5A3825]">
            Click item to inspect AST root cause & auto-patch
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#DCC7AE]/80 text-[#5A3825] font-mono uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Severity</th>
                <th className="py-3 px-3">ID & Title</th>
                <th className="py-3 px-3">Genome Invariant</th>
                <th className="py-3 px-3">Confidence</th>
                <th className="py-3 px-3">File & Sink</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCC7AE]/40">
              {vulns.map((v) => (
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
                    <div className="text-[11px] text-[#5A3825] font-normal font-sans">{v.title}</div>
                  </td>
                  <td className="py-3.5 px-3 font-mono">
                    <span className="px-2 py-0.5 rounded bg-[#3B2418] text-[#FFF9F0] font-bold text-[11px]">
                      {v.genomeId}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-emerald-700">
                    {v.confidence}%
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[#3B2418]">
                    <div className="truncate max-w-[200px]">{v.file}:{v.line}</div>
                    <div className="text-[10px] text-[#5A3825] uppercase">{v.language}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={v.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => onNavigate(`vulnerabilities/${v.id}`)}
                      className="px-3 py-1 rounded-lg bg-[#3B2418] group-hover:bg-[#5A3825] text-[#FFF9F0] text-xs font-bold font-mono transition-colors inline-flex items-center gap-1"
                    >
                      <span>Analyze</span>
                      <ChevronRight className="w-3 h-3 text-[#B88A52]" />
                    </button>
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
