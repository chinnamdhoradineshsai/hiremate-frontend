import React from 'react';
import { Menu, Cpu, Bell, Bot, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  activeTab: string;
  setSidebarOpen: (open: boolean) => void;
  onOpenAssistant?: () => void;
  currentCompany?: string;
  currentRole?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setSidebarOpen, 
  onOpenAssistant,
  currentCompany = 'TCS',
  currentRole = 'Software Engineer'
}) => {
  const { user } = useAuth();

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'AI Command Center';
      case 'resume': return 'Resume & ATS Intelligence';
      case 'interview': return 'AI Interview Room Simulator';
      case 'research': return 'Company Interview Research';
      case 'learning': return 'Personalized Skill-Gap Roadmap';
      case 'progress': return 'Performance & Score Analytics';
      case 'questions': return 'Question History Vault';
      case 'chat': return 'AI Career Assistant';
      case 'settings': return 'Platform Gateway Settings';
      default: return 'HireMate Career Platform';
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-white/10 px-6 py-3.5 flex items-center justify-between backdrop-blur-xl bg-dark-900/70">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors border border-white/10"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg md:text-xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
            {getTitle()}
          </h1>
          <p className="text-[11px] text-slate-400 hidden sm:block">Prepare Smarter. Interview Better. Get Hired.</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Current Active Company / Role Indicator */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
          <Building2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>{currentCompany} ({currentRole})</span>
        </div>

        {/* AI Gateway Online Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <Cpu className="w-3.5 h-3.5" />
          <span>HireMate AI Gateway Active</span>
        </div>

        {/* Quick AI Assistant Button */}
        {onOpenAssistant && (
          <button
            onClick={onOpenAssistant}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-600/30 to-cyan-500/30 hover:from-purple-600/50 hover:to-cyan-500/50 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all shadow-lg hover:scale-105"
          >
            <Bot className="w-4 h-4 text-cyan-400 animate-bounce" />
            <span className="hidden sm:inline">Ask AI Assistant</span>
          </button>
        )}

        {/* Notifications Icon */}
        <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400" />
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-full p-1 pr-3">
          <img
            src={user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
            alt={user?.name || "Candidate"}
            className="w-7 h-7 rounded-full object-cover ring-2 ring-purple-500/40"
          />
          <span className="text-xs font-bold text-slate-200 hidden sm:inline">
            {user?.name || "Rayn"}
          </span>
        </div>
      </div>
    </header>
  );
};
