import React, { useState, useEffect } from 'react';
import { 
  Scan, 
  ShieldAlert, 
  ShieldCheck, 
  Dna, 
  AlertTriangle, 
  Gauge, 
  ArrowRight, 
  Sparkles, 
  Eye, 
  Wrench, 
  Clock, 
  PlusCircle, 
  Radio, 
  ExternalLink,
  Layers,
  ChevronRight,
  Shield,
  FileCode,
  Bot
} from 'lucide-react';
import { MetricCard } from '../components/common/MetricCard';
import { SecurityScore } from '../components/common/SecurityScore';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { TrendChart } from '../components/dashboard/TrendChart';
import { Vulnerability, SecurityStats } from '../types';
import { vulnerabilityService } from '../services/vulnerabilityService';
import { patchService } from '../services/patchService';
import { INITIAL_STATS, INITIAL_TIME_MACHINE_EVENTS } from '../data/mockData';
import { useToast } from '../context/ToastContext';
import { agentControlService } from '../services/agentControlService';

interface DashboardPageProps {
  onNavigate: (route: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<SecurityStats>(INITIAL_STATS);
  const [alerts, setAlerts] = useState<Vulnerability[]>([]);
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState(agentControlService.getAgents());
  const { success, info } = useToast();

  useEffect(() => {
    const unsub = agentControlService.subscribe(() => {
      setAgents([...agentControlService.getAgents()]);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const vulns = await vulnerabilityService.getVulnerabilities();
        setAlerts(vulns);
        const fixed = vulns.filter(v => v.status === 'FIXED' || v.status === 'VERIFIED').length;
        const criticals = vulns.filter(v => v.severity === 'CRITICAL' && v.status !== 'FIXED').length;
        setStats(prev => ({
          ...prev,
          totalVulnerabilities: vulns.length,
          fixedVulnerabilities: fixed,
          criticalVulnerabilities: criticals,
          securityScore: Math.max(72, 100 - (criticals * 4 + (vulns.length - fixed) * 2))
        }));
      } catch (err) {
        // fallback
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const handleGeneratePatch = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await patchService.generatePatch(id);
      success('Autonomous Patch Synthesized', `CrewAI compiled secure invariant diff for ${id}`);
      onNavigate(`vulnerabilities/${id}`);
    } catch (err: any) {
      // ignore
    }
  };

  const handleIgnoreAlert = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await vulnerabilityService.ignoreVulnerability(id);
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'IGNORED' } : a));
      info('Alert Marked Ignored', `${id} moved to false-positive archive.`);
    } catch (err) {
      // ignore
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#B88A52]">
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#B88A52]" />
            Defense Sector Intelligence
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-[#24150F] tracking-tight mt-0.5">
            Security Overview
          </h1>
          <p className="text-xs text-[#5A3825] mt-1">
            Real-time autonomous vulnerability intelligence across your software ecosystem.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('agent-control')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#B88A52] hover:bg-[#a67943] text-[#24150F] text-xs font-bold font-mono uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            <Bot className="w-4 h-4 text-[#24150F]" />
            <span>AI Agent Swarm Control</span>
          </button>

          <button
            onClick={() => onNavigate('scan')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B2418] hover:bg-[#5A3825] text-[#FFF9F0] text-xs font-bold font-mono uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            <Scan className="w-4 h-4 text-[#B88A52]" />
            <span>Launch Security Scan</span>
          </button>
        </div>
      </div>

      {/* Top 6 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title="Total Scans"
          value={stats.totalScans.toLocaleString()}
          subtitle="Air-Gapped & CI/CD"
          icon={<Scan className="w-5 h-5" />}
          trend={{ value: '+14% /mo', direction: 'up', isPositive: true }}
          onClick={() => onNavigate('scans')}
        />
        <MetricCard
          title="Vulnerabilities"
          value={stats.totalVulnerabilities}
          subtitle="Identified Sinks"
          icon={<ShieldAlert className="w-5 h-5 text-amber-600" />}
          accentColor="#D97706"
          onClick={() => onNavigate('vulnerabilities')}
        />
        <MetricCard
          title="Fixed & Certified"
          value={stats.fixedVulnerabilities}
          subtitle="Verified by Proof"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
          accentColor="#059669"
          trend={{ value: '94.3% rate', direction: 'up', isPositive: true }}
          onClick={() => onNavigate('certificates')}
        />
        <MetricCard
          title="Genome Library"
          value={stats.totalGenomes}
          subtitle="Invariant Models"
          icon={<Dna className="w-5 h-5 text-[#B88A52]" />}
          accentColor="#B88A52"
          trend={{ value: '+6 new', direction: 'up', isPositive: true }}
          onClick={() => onNavigate('genomes')}
        />
        <MetricCard
          title="Critical Issues"
          value={stats.criticalVulnerabilities}
          subtitle="Unresolved Sinks"
          icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
          accentColor="#DC2626"
          trend={{ value: '2 Pending', direction: 'down', isPositive: false }}
          onClick={() => onNavigate('vulnerabilities')}
        />
        <MetricCard
          title="Security Score"
          value={`${stats.securityScore}%`}
          subtitle="System Hardening"
          icon={<Gauge className="w-5 h-5 text-emerald-700" />}
          accentColor="#059669"
          trend={{ value: 'Defense Ready', direction: 'neutral', isPositive: true }}
        />
      </div>

      {/* Circular Security Score & Trend Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 flex flex-col">
          <SecurityScore
            score={stats.securityScore}
            detectionRate={stats.detectionRate}
            patchSuccessRate={stats.patchSuccessRate}
            verificationAccuracy={stats.verificationAccuracy}
            falsePositiveRate={stats.falsePositiveRate}
            className="h-full"
          />
        </div>
        <div className="lg:col-span-7 flex flex-col">
          <TrendChart className="h-full" />
        </div>
      </div>

      {/* Live AI Cyber Defense Agent Swarm Quick Grid */}
      <div className="p-6 rounded-2xl glass-frame space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#3B2418] text-[#B88A52] flex items-center justify-center border border-[#B88A52]/40 shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-display text-[#24150F]">
                  Active AI Swarm Defense Units
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-500/20">
                  6 UNITS ONLINE
                </span>
              </div>
              <p className="text-xs text-[#5A3825]">
                Autonomous agents continuously parsing AST invariants, synthesizing zero-regression patches, and verifying Z3 proofs.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('agent-control')}
            className="text-xs font-bold text-[#3B2418] hover:text-[#B88A52] flex items-center gap-1 font-mono transition-colors cursor-pointer"
          >
            <span>Open AI Agent Control System</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 6 Agents Quick Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {agents.map((agent) => {
            const isAnalyzing = agent.status === 'ANALYZING';
            const isExecuting = agent.status === 'EXECUTING';
            const isVerifying = agent.status === 'VERIFYING';
            const isAlert = agent.status === 'ALERT';

            let statusColor = 'bg-gray-100 text-gray-800 border-gray-300';
            if (isAnalyzing) statusColor = 'bg-cyan-100 text-cyan-800 border-cyan-300';
            if (isExecuting) statusColor = 'bg-purple-100 text-purple-800 border-purple-300';
            if (isVerifying) statusColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
            if (isAlert) statusColor = 'bg-red-100 text-red-800 border-red-300';

            return (
              <div
                key={agent.id}
                onClick={() => onNavigate('agent-control')}
                className="p-3.5 rounded-xl glass-pill hover:bg-white/90 border border-[#DCC7AE]/70 hover:border-[#B88A52] transition-all cursor-pointer shadow-xs group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-xs text-[#24150F] group-hover:text-[#3B2418]">
                      {agent.name}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold border ${statusColor}`}>
                    {agent.status}
                  </span>
                </div>
                <div className="text-[11px] text-[#5A3825] font-sans line-clamp-1 mb-2">
                  {agent.specialty}
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#5A3825] border-t border-[#DCC7AE]/40 pt-1.5">
                  <span>Accuracy: <strong className="text-emerald-800">{agent.accuracyRate}%</strong></span>
                  <span>Autonomy: <strong className="text-[#3B2418]">{agent.autonomyLevel}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Security Alerts Table */}
      <div className="p-6 rounded-2xl glass-frame space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#5A3825]">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              Live Security Ingestion Alerts
            </div>
            <h3 className="text-lg font-bold font-display text-[#24150F] mt-0.5">
              Active Vulnerability Sinks
            </h3>
          </div>

          <button
            onClick={() => onNavigate('vulnerabilities')}
            className="text-xs font-bold text-[#3B2418] hover:text-[#B88A52] flex items-center gap-1 font-mono transition-colors"
          >
            <span>View All Vulnerabilities</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-[#DCC7AE]/50 bg-white/40">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#DCC7AE]/80 text-[#5A3825] font-mono uppercase text-[10px] tracking-wider bg-[#F5EBDD]/50">
                <th className="py-3 px-3.5">Severity</th>
                <th className="py-3 px-3.5">Vulnerability ID</th>
                <th className="py-3 px-3.5">Genome Match</th>
                <th className="py-3 px-3.5">Confidence</th>
                <th className="py-3 px-3.5">Affected File & Line</th>
                <th className="py-3 px-3.5">Status</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCC7AE]/40">
              {alerts.map((alert) => (
                <tr
                  key={alert.id}
                  onClick={() => onNavigate(`vulnerabilities/${alert.id}`)}
                  className="hover:bg-white/70 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-3.5">
                    <RiskBadge severity={alert.severity} size="sm" />
                  </td>
                  <td className="py-3.5 px-3.5 font-mono font-bold text-[#24150F]">
                    <div>{alert.id}</div>
                    <div className="text-[10px] text-[#5A3825] font-normal font-sans truncate max-w-[180px]">
                      {alert.title}
                    </div>
                  </td>
                  <td className="py-3.5 px-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-[#3B2418] text-[#FFF9F0] font-mono text-[11px] font-bold shadow-xs">
                      {alert.genomeId}
                    </span>
                  </td>
                  <td className="py-3.5 px-3.5 font-mono font-bold text-[#3B2418]">
                    <span className="text-emerald-700">{alert.confidence}%</span>
                  </td>
                  <td className="py-3.5 px-3.5 font-mono text-[#3B2418]">
                    <div className="truncate max-w-[200px]">{alert.file}:{alert.line}</div>
                    <div className="text-[10px] text-[#5A3825] uppercase">{alert.language}</div>
                  </td>
                  <td className="py-3.5 px-3.5">
                    <StatusBadge status={alert.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onNavigate(`vulnerabilities/${alert.id}`)}
                        className="px-2.5 py-1 rounded-lg glass-pill hover:bg-white text-[#3B2418] text-[11px] font-bold transition-colors"
                      >
                        View
                      </button>
                      {alert.status !== 'FIXED' && alert.status !== 'VERIFIED' && (
                        <button
                          onClick={(e) => handleGeneratePatch(alert.id, e)}
                          className="px-2.5 py-1 rounded-lg bg-[#3B2418] hover:bg-[#5A3825] text-[#FFF9F0] text-[11px] font-bold transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <Wrench className="w-3 h-3 text-[#B88A52]" />
                          <span>Patch</span>
                        </button>
                      )}
                      {alert.status === 'CONFIRMED' && (
                        <button
                          onClick={(e) => handleIgnoreAlert(alert.id, e)}
                          className="px-2 py-1 rounded-lg hover:bg-black/5 text-[#5A3825] text-[11px] transition-colors"
                          title="Mark as false positive"
                        >
                          Ignore
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

      {/* Lower Row: Genome Library Overview & Security Time Machine Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Genome Library Overview */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-frame flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#5A3825]">
                <Dna className="w-4 h-4 text-[#B88A52]" />
                Genome Knowledge Base
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-[#B88A52]/20 text-[#3B2418] border border-[#B88A52]/30">
                127 Active Invariants
              </span>
            </div>

            <h3 className="text-base font-bold font-display text-[#24150F]">
              Polyglot Security Invariants
            </h3>
            <p className="text-xs text-[#5A3825] mt-1 leading-relaxed">
              Once extracted, a vulnerability invariant protects across all supported languages (Java, Python, C++, JavaScript, Go, Rust).
            </p>

            <div className="grid grid-cols-2 gap-2.5 my-4">
              <div className="p-3 rounded-xl glass-pill">
                <div className="text-[10px] text-[#5A3825] uppercase font-mono font-bold">Languages Covered</div>
                <div className="text-lg font-bold font-mono text-[#24150F] mt-0.5">8 Runtimes</div>
              </div>
              <div className="p-3 rounded-xl glass-pill">
                <div className="text-[10px] text-[#5A3825] uppercase font-mono font-bold">Recently Added</div>
                <div className="text-lg font-bold font-mono text-[#B88A52] mt-0.5">+6 Invariants</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-[#5A3825] uppercase font-mono">Most Detected Patterns:</div>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-lg bg-[#24150F] text-[#FFF9F0] font-mono text-xs shadow-xs border border-[#5A3825]">SQL Injection (47)</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#24150F] text-[#FFF9F0] font-mono text-xs shadow-xs border border-[#5A3825]">DOM XSS (32)</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#24150F] text-[#FFF9F0] font-mono text-xs shadow-xs border border-[#5A3825]">Buffer Overflow (19)</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#24150F] text-[#FFF9F0] font-mono text-xs shadow-xs border border-[#5A3825]">Hardcoded Secrets (24)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('genomes')}
            className="w-full py-2.5 rounded-xl bg-[#3B2418] hover:bg-[#5A3825] text-[#FFF9F0] text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <span>Open Genome Library</span>
            <ArrowRight className="w-4 h-4 text-[#B88A52]" />
          </button>
        </div>

        {/* Security Time Machine Horizontal Timeline Preview */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-frame flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#5A3825]">
                <Clock className="w-4 h-4 text-[#B88A52]" />
                Security Time Machine
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-emerald-100/90 text-emerald-800 border border-emerald-200">
                138 Hours Saved
              </span>
            </div>

            <h3 className="text-base font-bold font-display text-[#24150F]">
              Vulnerability Invariant Memory Timeline
            </h3>
            <p className="text-xs text-[#5A3825] mt-1 leading-relaxed">
              Trace how historical exploits were learned once and automatically prevented in future deployments.
            </p>

            {/* Horizontal Timeline Preview */}
            <div className="my-5 relative">
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-[#DCC7AE]" />
              <div className="grid grid-cols-4 gap-2 relative z-10">
                {INITIAL_TIME_MACHINE_EVENTS.slice(0, 4).map((evt, idx) => (
                  <div key={evt.id} className="flex flex-col items-center text-center">
                    <div className="w-8 h-8 rounded-full bg-[#3B2418] text-[#B88A52] border-2 border-[#B88A52] flex items-center justify-center text-xs font-bold mb-2 shadow-xs">
                      0{idx + 1}
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#5A3825]">{evt.date}</span>
                    <span className="text-xs font-bold text-[#24150F] line-clamp-1 mt-0.5">{evt.vulnTitle}</span>
                    <span className="text-[10px] text-emerald-700 font-mono font-semibold">+{evt.timeSavedHours}h saved</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('time-machine')}
            className="w-full py-2.5 rounded-xl glass-pill hover:bg-white text-[#3B2418] text-xs font-bold font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Launch Interactive Time Machine</span>
            <ArrowRight className="w-4 h-4 text-[#B88A52]" />
          </button>
        </div>
      </div>
    </div>
  );
};
