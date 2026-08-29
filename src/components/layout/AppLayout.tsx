import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface AppLayoutProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentRoute,
  onNavigate,
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleMobileNavigate = (route: string) => {
    onNavigate(route);
    setIsMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F5EBDD] text-[#3B2418] flex flex-col selection:bg-[#B88A52]/30 selection:text-[#24150F] relative overflow-x-hidden">
      {/* Subtle Ambient Glass Orbs & Grid in Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#B88A52]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-[#DCC7AE]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] bg-[#B88A52]/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 glass-ambient-grid opacity-60" />
      </div>

      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block relative z-40">
        <Sidebar
          currentRoute={currentRoute}
          onNavigate={onNavigate}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-[#24150F]/70 backdrop-blur-md flex">
          <div className="w-72 bg-[#3B2418]/95 backdrop-blur-2xl h-full shadow-2xl border-r border-[#5A3825]">
            <Sidebar
              currentRoute={currentRoute}
              onNavigate={handleMobileNavigate}
              isCollapsed={false}
              onToggleCollapse={() => setIsMobileOpen(false)}
            />
          </div>
          <div className="flex-1" onClick={() => setIsMobileOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 relative z-10 ${
          isCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        <Topbar
          onNavigate={onNavigate}
          onToggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto pb-16">
          {children}
        </main>
      </div>
    </div>
  );
};
