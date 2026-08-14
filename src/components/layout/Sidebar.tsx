import React from 'react';
import { 
  LayoutDashboard, FileText, Video, Search, GraduationCap, 
  BarChart3, HelpCircle, Bot, Settings, LogOut, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onOpenAssistant?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isOpen, 
  setIsOpen,
  onOpenAssistant 
}) => {
  const { logout, isAdminAuthenticated } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'resume', label: 'Resume & ATS', icon: FileText },
    { id: 'interview', label: 'AI Interview', icon: Video },
    { id: 'research', label: 'Company Research', icon: Search },
    { id: 'learning', label: 'Learning Roadmap', icon: GraduationCap },
    { id: 'questions', label: 'Question Vault', icon: HelpCircle },
    { id: 'progress', label: 'Analytics', icon: BarChart3 },
    { id: 'chat', label: 'AI Career Assistant', icon: Bot, isAssistantTrigger: true },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-md lg:hidden" 
        />
      )}

      <aside className={`
        fixed lg:static top-0 left-0 z-50 h-screen w-64 glass-panel border-r border-white/5 flex flex-col justify-between p-5 transition-transform duration-300 ease-in-out shrink-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-8">
          {/* Logo Header */}
          <div className="flex items-center space-x-3 px-2 py-2 border-b border-white/5">
            <div className="w-8 h-8 rounded-full border border-amber-500/40 bg-amber-500/10 flex items-center justify-center text-amber-400 font-display font-bold text-xs">
              H
            </div>
            <div>
              <h2 className="text-lg font-display font-light tracking-[0.15em] text-white">
                HIRE<span className="font-bold text-amber-400">MATE</span>
              </h2>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400">
                EOS AI ENGINE
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.isAssistantTrigger && onOpenAssistant) {
                      onOpenAssistant();
                    } else {
                      setActiveTab(item.id);
                    }
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-xs tracking-wider transition-all duration-200 group uppercase
                    ${isActive 
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold shadow-lg shadow-amber-500/5' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'}
                  `}
                >
                  <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-amber-300'
                  }`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="border-t border-white/5 pt-4 space-y-2">
          {isAdminAuthenticated && (
            <button
              onClick={() => setActiveTab('admin-dashboard')}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-mono font-bold transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Admin Portal
            </button>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-white/5 border border-transparent transition-all text-xs font-mono"
          >
            <span className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              SIGN OUT
            </span>
            <span className="text-[10px] text-slate-500">v2.0</span>
          </button>
        </div>
      </aside>
    </>
  );
};
