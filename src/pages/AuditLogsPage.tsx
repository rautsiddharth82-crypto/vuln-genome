import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  ShieldCheck, 
  Clock, 
  User, 
  Terminal,
  Filter
} from 'lucide-react';
import { AuditLogEntry } from '../types';
import { auditService } from '../services/auditService';
import { useToast } from '../context/ToastContext';

interface AuditLogsPageProps {
  onNavigate: (route: string) => void;
}

export const AuditLogsPage: React.FC<AuditLogsPageProps> = ({ onNavigate }) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { success } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await auditService.getAuditLogs();
        setLogs(data);
      } catch (err) {
        // fallback
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = logs.filter((l) => {
    return (
      l.id.toLowerCase().includes(search.toLowerCase()) ||
      l.user.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.resource.toLowerCase().includes(search.toLowerCase()) ||
      l.ip.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['ID,Timestamp,User,Action,Resource,IP,Status']
        .concat(
          filtered.map(
            (l) => `${l.id},${l.timestamp},${l.user},${l.action},${l.resource},${l.ip},${l.status}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VULN_GENOME_AUDIT_LOGS_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Audit Trail Exported', 'CSV downloaded for compliance record.');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#B88A52]">
            <FileText className="w-4 h-4 text-[#B88A52]" />
            Compliance & Security Telemetry
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-[#24150F] tracking-tight mt-0.5">
            Audit Logs
          </h1>
          <p className="text-xs text-[#5A3825] mt-1">
            Immutable system event trail for all AST analyses, patch generations, and certificate operations.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B2418] hover:bg-[#5A3825] text-[#FFF9F0] text-xs font-bold font-mono uppercase tracking-wider transition-all shadow-md cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#B88A52]" />
          <span>Export Audit Trail (CSV)</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#DCC7AE]/70 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A3825]/60" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by User, Action, Resource, or IP..."
            className="w-full pl-9 pr-4 py-2 bg-[#F5EBDD]/50 border border-[#DCC7AE] rounded-xl text-xs font-mono text-[#24150F] outline-hidden focus:bg-white focus:border-[#B88A52]"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#DCC7AE]/70 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#DCC7AE]/80 text-[#5A3825] font-mono uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Log ID</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Operator</th>
                <th className="py-3 px-3">Action Event</th>
                <th className="py-3 px-3">Target Resource</th>
                <th className="py-3 px-3">IP Address</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCC7AE]/40 font-mono">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-[#F5EBDD]/50 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-[#24150F]">{log.id}</td>
                  <td className="py-3.5 px-3 text-[#5A3825]">{log.timestamp}</td>
                  <td className="py-3.5 px-3 font-bold text-[#3B2418]">{log.user}</td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-[#3B2418] text-[#FFF9F0] text-[10px] font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-[#3B2418] truncate max-w-[200px]">{log.resource}</td>
                  <td className="py-3.5 px-3 text-[#5A3825]">{log.ip}</td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {log.status}
                    </span>
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
