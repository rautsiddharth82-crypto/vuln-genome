import React from 'react';
import { 
  LayoutDashboard, 
  Scan, 
  History, 
  ShieldAlert, 
  Dna, 
  Award, 
  History as TimeMachineIcon, 
  FileText, 
  Settings, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  Radio,
  Lock,
  Bot
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSystem } from '../../context/SystemContext';

export type NavRoute = 
  | 'dashboard'
  | 'agent-control'
  | 'scan'
  | 'scans'
  | 'vulnerabilities'
  | 'genomes'
  | 'certificates'
  | 'time-machine'
  | 'audit-logs'
  | 'settings';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { user } = useAuth();
  const { backendConnected, genomeEngineOnline, testingEngineOnline, airGappedMode } = useSystem();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'agent-control', label: 'AI Agent Control', icon: <Bot className="w-4 h-4 text-amber-400" />, highlight: true, badge: 'AI SWARM' },
    { id: 'scan', label: 'Scan Code', icon: <Scan className="w-4 h-4" /> },
    { id: 'scans', label: 'Scan History', icon: <History className="w-4 h-4" /> },
    { id: 'vulnerabilities', label: 'Vulnerabilities', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'genomes', label: 'Genome Library', icon: <Dna className="w-4 h-4" /> },
    { id: 'certificates', label: 'Proof Certificates', icon: <Award className="w-4 h-4" /> },
    { id: 'time-machine', label: 'Security Time Machine', icon: <TimeMachineIcon className="w-4 h-4" /> },
    { id: 'audit-logs', label: 'Audit Logs', icon: <FileText className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-[#3B2418]/90 backdrop-blur-2xl text-[#FFF9F0] border-r border-[#5A3825]/70 shadow-2xl transition-all duration-300 flex flex-col justify-between ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="p-4 border-b border-[#5A3825]/60 flex items-center justify-between">
          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            {/* Logo Emblem: Shield + DNA + Node Node */}
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#B88A52] to-[#5A3825] p-0.5 flex items-center justify-center shadow-lg border border-[#B88A52]/40 shrink-0">
              <div className="w-full h-full bg-[#24150F] rounded-[10px] flex items-center justify-center">
                <Dna className="w-5 h-5 text-[#B88A52]" />
              </div>
            </div>

            {!isCollapsed && (
              <div className="leading-tight">
                <div className="text-base font-black font-display tracking-wider text-[#FFF9F0] flex items-center gap-1">
                  <span>VULN-GENOME</span>
                </div>
                <div className="text-[9px] uppercase font-mono tracking-widest text-[#B88A52] font-semibold">
                  Autonomous Intel
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 rounded-lg bg-[#24150F]/80 text-[#DCC7AE] hover:text-[#FFF9F0] hover:bg-[#5A3825] border border-[#5A3825]/40 transition-colors shadow-xs"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-280px)]">
          {navItems.map((item) => {
            const isActive = currentRoute === item.id || currentRoute.startsWith(`${item.id}/`);
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#B88A52] text-[#24150F] shadow-md font-bold'
                    : 'text-[#DCC7AE] hover:bg-[#5A3825]/50 hover:text-[#FFF9F0]'
                } ${item.highlight && !isActive ? 'border border-[#B88A52]/40 bg-[#B88A52]/10' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="shrink-0">{item.icon}</div>
                {!isCollapsed && <span className="truncate">{item.label}</span>}
                {item.highlight && !isCollapsed && !isActive && (
                  <span className="ml-auto text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-md bg-[#B88A52]/20 text-[#B88A52] border border-[#B88A52]/30">
                    {item.badge || 'SCAN'}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Status & User Profile Bottom Area */}
      <div className="p-3 border-t border-[#5A3825]/60 bg-[#24150F]/80 backdrop-blur-md space-y-3">
        {/* System Health Status Indicators */}
        {!isCollapsed && (
          <div className="p-2.5 rounded-xl bg-[#1C100B]/90 border border-[#5A3825]/50 space-y-1.5 text-[10px] font-mono shadow-inner">
            <div className="flex items-center justify-between text-[#DCC7AE]">
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${backendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
                Backend Gateway
              </span>
              <span className="text-emerald-400 font-bold">{backendConnected ? 'CONNECTED' : 'DISCONNECTED'}</span>
            </div>

            <div className="flex items-center justify-between text-[#DCC7AE]">
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${genomeEngineOnline ? 'bg-[#B88A52]' : 'bg-gray-500'}`} />
                Genome Engine
              </span>
              <span className="text-[#B88A52] font-bold">{genomeEngineOnline ? 'ONLINE' : 'OFFLINE'}</span>
            </div>

            <div className="flex items-center justify-between text-[#DCC7AE]">
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${testingEngineOnline ? 'bg-emerald-400' : 'bg-gray-500'}`} />
                Testing Engine
              </span>
              <span className="text-emerald-400 font-bold">{testingEngineOnline ? 'ONLINE' : 'OFFLINE'}</span>
            </div>

            {airGappedMode && (
              <div className="pt-1 mt-1 border-t border-[#5A3825]/40 flex items-center justify-between text-amber-400">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Air-Gapped Mode
                </span>
                <span className="font-bold">ACTIVE</span>
              </div>
            )}
          </div>
        )}

        {/* User Card */}
        {user && (
          <div className={`p-2 rounded-xl bg-[#3B2418]/90 border border-[#5A3825]/60 flex items-center shadow-xs ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
            <div className="w-8 h-8 rounded-lg bg-[#B88A52] text-[#24150F] font-bold flex items-center justify-center text-xs shrink-0 font-display shadow-xs">
              {user.name.charAt(0)}
            </div>

            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-[#FFF9F0] truncate">{user.name}</div>
                <div className="text-[10px] text-[#B88A52] font-mono truncate">Role: {user.role}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
