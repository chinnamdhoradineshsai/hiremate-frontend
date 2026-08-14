import React from 'react';
import { 
  LayoutDashboard, Users, Activity, Building2, Video, 
  FileText, Map, MessageSquare, Server, Settings, 
  Play, LogOut, ShieldCheck, X 
} from 'lucide-react';

export type AdminTabType = 
  | 'overview' 
  | 'users' 
  | 'activity' 
  | 'companies' 
  | 'interviews' 
  | 'ats' 
  | 'roadmaps' 
  | 'chatbot' 
  | 'system-status' 
  | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTabType;
  setActiveTab: (tab: AdminTabType) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onTestApplication: () => void;
  onLogout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  onTestApplication,
  onLogout
}) => {
  const navItems: { id: AdminTabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'activity', label: 'User Activity', icon: Activity },
    { id: 'companies', label: 'Companies & Research', icon: Building2 },
    { id: 'interviews', label: 'Interviews', icon: Video },
    { id: 'ats', label: 'ATS', icon: FileText },
    { id: 'roadmaps', label: 'Roadmaps', icon: Map },
    { id: 'chatbot', label: 'Chatbot', icon: MessageSquare },
    { id: 'system-status', label: 'System Status', icon: Server },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-64 bg-dark-900/95 lg:bg-dark-900 border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Header & Logo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl border border-amber-500/40 bg-amber-500/10 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="font-display font-light text-lg tracking-wider text-white block">
                  ADMIN<span className="font-bold text-amber-400">PORTAL</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                  HireMate Control Center
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="h-px bg-white/10" />

          {/* Navigation Items */}
          <nav className="space-y-1">
            <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
              Monitoring & Insights
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold shadow-lg shadow-amber-500/5'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Action Button: Test Application & Logout */}
        <div className="p-4 border-t border-white/10 space-y-2 bg-dark-950/50">
          <button
            onClick={onTestApplication}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs tracking-wider uppercase bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-dark-950 shadow-lg shadow-amber-500/20 transition-all font-mono"
          >
            <Play className="w-4 h-4 fill-dark-950" />
            Test Application
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-bold text-xs tracking-wider uppercase bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-all font-mono"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout Admin
          </button>
        </div>
      </aside>
    </>
  );
};
