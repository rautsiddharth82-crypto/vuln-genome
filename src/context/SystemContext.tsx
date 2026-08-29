import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { auditService } from '../services/auditService';

interface SystemContextType {
  airGappedMode: boolean;
  setAirGappedMode: (enabled: boolean) => void;
  toggleAirGappedMode: () => void;
  backendConnected: boolean;
  genomeEngineOnline: boolean;
  testingEngineOnline: boolean;
  activeNotificationsCount: number;
  clearNotifications: () => void;
  checkBackendHealth: () => Promise<boolean>;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [airGappedMode, setAirGappedModeState] = useState<boolean>(() => {
    return localStorage.getItem('vuln_genome_airgap') === 'true';
  });
  const [backendConnected, setBackendConnected] = useState(true);
  const [genomeEngineOnline, setGenomeEngineOnline] = useState(true);
  const [testingEngineOnline, setTestingEngineOnline] = useState(true);
  const [activeNotificationsCount, setActiveNotificationsCount] = useState(3);
  const { info, warning } = useToast();

  const setAirGappedMode = (enabled: boolean) => {
    setAirGappedModeState(enabled);
    localStorage.setItem('vuln_genome_airgap', String(enabled));
    if (enabled) {
      warning('Air-Gapped Mode Activated', 'Network interfaces isolated. Source analysis strictly local.');
      auditService.logAction('AIR_GAP_MODE_ENABLED', 'System Core Configuration', 'SUCCESS', 'Isolated network ingress for classified DoD telemetry.');
    } else {
      info('Standard Network Mode', 'External CVE intelligence and remote repositories accessible.');
      auditService.logAction('AIR_GAP_MODE_DISABLED', 'System Core Configuration', 'SUCCESS', 'Standard network gateway re-enabled.');
    }
  };

  const toggleAirGappedMode = () => {
    setAirGappedMode(!airGappedMode);
  };

  const checkBackendHealth = async (): Promise<boolean> => {
    try {
      // simulate health ping
      await new Promise(r => setTimeout(r, 400));
      setBackendConnected(true);
      setGenomeEngineOnline(true);
      setTestingEngineOnline(true);
      return true;
    } catch {
      setBackendConnected(false);
      return false;
    }
  };

  const clearNotifications = () => {
    setActiveNotificationsCount(0);
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  return (
    <SystemContext.Provider
      value={{
        airGappedMode,
        setAirGappedMode,
        toggleAirGappedMode,
        backendConnected,
        genomeEngineOnline,
        testingEngineOnline,
        activeNotificationsCount,
        clearNotifications,
        checkBackendHealth,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within SystemProvider');
  }
  return context;
};
