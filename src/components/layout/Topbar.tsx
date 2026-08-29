import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Shield, 
  Lock, 
  Unlock, 
  LogOut, 
  Menu, 
  X,
  ExternalLink,
  ChevronDown,
  Cpu,
  CheckCircle2,
  FileCode
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSystem } from '../../context/SystemContext';
import { ConfirmationDialog } from '../common/ConfirmationDialog';

interface TopbarProps {
  onNavigate: (route: string) => void;
  onToggleMobileMenu: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onNavigate, onToggleMobileMenu }) => {
  const { user, logout } = useAuth();
  const { airGappedMode, toggleAirGappedMode, activeNotificationsCount, clearNotifications } = useSystem();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery || typeof searchQuery !== 'string' || !searchQuery.trim()) return;
    const q = searchQuery.trim().toLowerCase();
    if (q.startsWith('sqli') || q.startsWith('xss') || q.startsWith('bof') || q.includes('cwe') || q.includes('genome')) {
      onNavigate('genomes');
    } else if (q.startsWith('vuln-') || q.includes('injection') || q.includes('overflow')) {
      onNavigate('vulnerabilities');
    } else if (q.startsWith('cert-')) {
      onNavigate('certificates');
    } else {
      onNavigate('vulnerabilities');
    }
  };

  return (
    <header className="sticky top-3 z-30 mx-4 md:mx-8 mt-3 mb-2 h-16 glass-frame rounded-2xl px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Search bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-xl glass-pill text-[#3B2418] hover:bg-white/80 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A3825]/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search CVE, CWE-89, Genome (SQLi-v1), or Scan ID..."
            className="w-full pl-10 pr-4 py-2 glass-input rounded-xl text-xs font-mono text-[#24150F] placeholder:text-[#5A3825]/60 outline-hidden"
          />
        </form>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick AI Swarm Link */}
        <button
          onClick={() => onNavigate('agent-control')}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#3B2418] hover:bg-[#5A3825] text-[#FFF9F0] border border-[#B88A52]/50 text-xs font-mono font-bold transition-all shadow-xs cursor-pointer"
          title="Open AI Agent Swarm Command Center"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[#B88A52]">AI SWARM</span>
          <span className="text-[10px] text-emerald-300 font-normal">ONLINE (6)</span>
        </button>

        {/* Air-Gapped Mode Toggle */}
        <button
          onClick={toggleAirGappedMode}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all shadow-xs ${
            airGappedMode
              ? 'bg-[#3B2418] text-[#FFF9F0] border-[#B88A52]'
              : 'glass-pill text-[#5A3825] hover:border-[#B88A52]/60 hover:bg-white/90'
          }`}
          title="Toggle Air-Gapped Defense Isolation"
        >
          {airGappedMode ? (
            <>
              <Lock className="w-3.5 h-3.5 text-[#B88A52]" />
              <span className="hidden sm:inline">AIR-GAPPED ON</span>
            </>
          ) : (
            <>
              <Unlock className="w-3.5 h-3.5 text-[#5A3825]" />
              <span className="hidden sm:inline">NETWORK READY</span>
            </>
          )}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl glass-pill hover:bg-white/90 text-[#3B2418] transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {activeNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {activeNotificationsCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 glass-frame rounded-2xl shadow-2xl p-4 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#DCC7AE]/60">
                <span className="font-bold font-display text-[#24150F]">Defense Alerts</span>
                <button
                  onClick={clearNotifications}
                  className="text-[10px] text-[#B88A52] hover:underline font-mono"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <div className="p-2.5 rounded-xl bg-red-50/90 border border-red-200/80 shadow-xs">
                  <div className="font-bold text-red-900">Critical AST Match</div>
                  <div className="text-[#5A3825] text-[11px]">UserSearchService.java:45 matches SQLi-v1 invariant.</div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50/90 border border-emerald-200/80 shadow-xs">
                  <div className="font-bold text-emerald-900">Proof Certificate Issued</div>
                  <div className="text-[#5A3825] text-[11px]">CERT-2026-0849-B3C signed for packet_parser.cpp.</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/70 border border-[#DCC7AE] shadow-xs">
                  <div className="font-bold text-[#24150F]">Time Machine Invariant</div>
                  <div className="text-[#5A3825] text-[11px]">Zero-day pattern prevented in release build.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User profile dropdown & Logout */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl glass-pill hover:bg-white/90 transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-[#3B2418] text-[#FFF9F0] font-bold text-xs flex items-center justify-center font-display shadow-xs">
              {user?.name.charAt(0) || 'U'}
            </div>
            <span className="hidden md:inline text-xs font-semibold text-[#24150F]">
              {user?.name || 'Operator'}
            </span>
            <ChevronDown className="w-3 h-3 text-[#5A3825]" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 glass-frame rounded-2xl shadow-2xl p-2 z-50 text-xs">
              <div className="p-2.5 border-b border-[#DCC7AE]/50 mb-1">
                <div className="font-bold text-[#24150F]">{user?.name}</div>
                <div className="text-[10px] text-[#5A3825] font-mono">{user?.email}</div>
                <div className="mt-1 inline-block px-1.5 py-0.5 rounded-md bg-[#B88A52]/20 text-[#3B2418] font-mono text-[9px] font-bold border border-[#B88A52]/30">
                  {user?.clearanceLevel}
                </div>
              </div>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onNavigate('settings');
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/80 text-[#3B2418] font-medium transition-colors"
              >
                Settings & API Status
              </button>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  setShowLogoutModal(true);
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50/90 text-red-700 font-semibold flex items-center gap-2 mt-1 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout Session</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation */}
      <ConfirmationDialog
        isOpen={showLogoutModal}
        title="Terminate Secure Session"
        message="Are you sure you want to log out? Your active JWT token will be revoked from this terminal."
        confirmText="Confirm Logout"
        isDestructive
        onConfirm={() => {
          setShowLogoutModal(false);
          logout();
        }}
        onCancel={() => setShowLogoutModal(false)}
      />
    </header>
  );
};
