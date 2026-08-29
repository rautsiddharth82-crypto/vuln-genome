import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { SystemProvider } from './context/SystemContext';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AgentControlPage } from './pages/AgentControlPage';
import { ScanCodePage } from './pages/ScanCodePage';
import { ScanResultsPage } from './pages/ScanResultsPage';
import { ScanHistoryPage } from './pages/ScanHistoryPage';
import { VulnerabilitiesPage } from './pages/VulnerabilitiesPage';
import { VulnerabilityDetailPage } from './pages/VulnerabilityDetailPage';
import { GenomesPage } from './pages/GenomesPage';
import { GenomeDetailPage } from './pages/GenomeDetailPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { CertificateDetailPage } from './pages/CertificateDetailPage';
import { TimeMachinePage } from './pages/TimeMachinePage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SettingsPage } from './pages/SettingsPage';

// Main Routing View
const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<string>('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#3B2418] text-[#F5EBDD] flex flex-col items-center justify-center font-mono text-xs">
        <div className="w-10 h-10 border-4 border-[#B88A52] border-t-transparent rounded-full animate-spin mb-4" />
        <div>Authenticating Air-Gapped Security Session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderRoute = () => {
    // Dynamic sub-route matching
    if (currentRoute.startsWith('scans/')) {
      const scanId = currentRoute.replace('scans/', '');
      return <ScanResultsPage scanId={scanId} onNavigate={setCurrentRoute} />;
    }
    if (currentRoute.startsWith('vulnerabilities/')) {
      const vulnId = currentRoute.replace('vulnerabilities/', '');
      return <VulnerabilityDetailPage vulnerabilityId={vulnId} onNavigate={setCurrentRoute} />;
    }
    if (currentRoute.startsWith('genomes/')) {
      const genomeId = currentRoute.replace('genomes/', '');
      return <GenomeDetailPage genomeId={genomeId} onNavigate={setCurrentRoute} />;
    }
    if (currentRoute.startsWith('certificates/')) {
      const certId = currentRoute.replace('certificates/', '');
      return <CertificateDetailPage certificateId={certId} onNavigate={setCurrentRoute} />;
    }

    switch (currentRoute) {
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentRoute} />;
      case 'agent-control':
        return <AgentControlPage onNavigate={setCurrentRoute} />;
      case 'scan':
        return <ScanCodePage onNavigate={setCurrentRoute} />;
      case 'scans':
        return <ScanHistoryPage onNavigate={setCurrentRoute} />;
      case 'vulnerabilities':
        return <VulnerabilitiesPage onNavigate={setCurrentRoute} />;
      case 'genomes':
        return <GenomesPage onNavigate={setCurrentRoute} />;
      case 'certificates':
        return <CertificatesPage onNavigate={setCurrentRoute} />;
      case 'time-machine':
        return <TimeMachinePage onNavigate={setCurrentRoute} />;
      case 'audit-logs':
        return <AuditLogsPage onNavigate={setCurrentRoute} />;
      case 'settings':
        return <SettingsPage onNavigate={setCurrentRoute} />;
      default:
        return <DashboardPage onNavigate={setCurrentRoute} />;
    }
  };

  return (
    <AppLayout currentRoute={currentRoute} onNavigate={setCurrentRoute}>
      {renderRoute()}
    </AppLayout>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <SystemProvider>
          <AppContent />
        </SystemProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
