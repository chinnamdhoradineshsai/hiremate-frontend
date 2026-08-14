import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { IntroSequence } from './components/layout/IntroSequence';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AICareerAssistantDrawer } from './components/ai/AICareerAssistantDrawer';
import { Lock, ArrowLeft, LogIn, LayoutDashboard } from 'lucide-react';
import { apiService } from './services/api';
import SpecularButton from './components/ui/SpecularButton';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { DashboardPage } from './pages/DashboardPage';
import { AtsPage } from './pages/AtsPage';
import { InterviewPrepPage } from './pages/InterviewPrepPage';
import { InterviewRoomPage } from './pages/InterviewRoomPage';
import { CompanyResearchPage } from './pages/CompanyResearchPage';
import { FinalReportPage } from './pages/FinalReportPage';
import { ChatbotPage } from './pages/ChatbotPage';
import { LearningRoadmapPage } from './pages/LearningRoadmapPage';
import { QuestionVaultPage } from './pages/QuestionVaultPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProgressAnalyticsPage } from './pages/ProgressAnalyticsPage';
import { DemoInterviewPage } from './pages/DemoInterviewPage';
import { DemoDashboardPage } from './pages/DemoDashboardPage';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, isAdminAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [loginMode, setLoginMode] = useState<'login' | 'signup'>('login');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [assistantDrawerOpen, setAssistantDrawerOpen] = useState(false);

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [finalReportData, setFinalReportData] = useState<any>(null);
  const [demoSummaryData, setDemoSummaryData] = useState<any>(null);
  const [showDemoUsedModal, setShowDemoUsedModal] = useState(false);

  // Sync hash routes e.g. #admin or /admin
  useEffect(() => {
    const handleHash = () => {
      const path = window.location.pathname;
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin/login' || hash === '#admin/login' || hash === '#admin-login') {
        setActiveTab('admin-login');
      } else if (path === '/admin' || hash === '#admin' || hash === '#admin-dashboard') {
        setActiveTab('admin-dashboard');
      }
    };
    handleHash();
    window.addEventListener('popstate', handleHash);
    window.addEventListener('hashchange', handleHash);
    return () => {
      window.removeEventListener('popstate', handleHash);
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  const handleStartDemo = async () => {
    const isAdminUnlocked = localStorage.getItem('hiremate_admin_unlocked') === 'true';
    let isDemoUsed = localStorage.getItem('hiremate_demo_used') === 'true';

    // Server-side check if authenticated
    if (isAuthenticated) {
      try {
        const res = await apiService.getDemoStatus();
        if (res.demo_used) {
          isDemoUsed = true;
          localStorage.setItem('hiremate_demo_used', 'true');
        }
      } catch (e) {}
    }

    if (isDemoUsed && !isAdminUnlocked) {
      setShowDemoUsedModal(true);
      return;
    }
    setActiveTab('demo-room');
  };

  // 1. DEMO ALREADY USED MODAL (Requirement 9)
  if (showDemoUsedModal) {
    return (
      <div className="min-h-screen bg-dark-900 text-slate-100 flex items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[180px] pointer-events-none" />
        
        <div className="w-full max-w-md glass-panel-gold p-8 flex flex-col items-center text-center space-y-6 relative z-10">
          <div className="w-16 h-16 rounded-full border border-amber-500/40 bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black font-display text-white tracking-wider uppercase">
              DEMO ALREADY USED
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed font-sans">
              You've already completed your free HireMate Demo.
              Continue using the full HireMate platform.
            </p>
          </div>

          <div className="w-full space-y-3 pt-2">
            {isAuthenticated ? (
              <SpecularButton
                size="lg"
                onClick={() => {
                  setShowDemoUsedModal(false);
                  setActiveTab('dashboard');
                }}
                tint="#f59e0b"
                tintOpacity={0.25}
                textColor="#ffffff"
                lineColor="#fbbf24"
                baseColor="#92400e"
                className="w-full py-4 shadow-xl font-bold"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-300 mr-2" />
                GO TO DASHBOARD
              </SpecularButton>
            ) : (
              <SpecularButton
                size="lg"
                onClick={() => {
                  setShowDemoUsedModal(false);
                  setLoginMode('login');
                  setActiveTab('login');
                }}
                tint="#ffffff"
                tintOpacity={0.9}
                textColor="#0f172a"
                lineColor="#ffffff"
                baseColor="#e2e8f0"
                className="w-full py-4 shadow-xl font-bold"
              >
                <LogIn className="w-4 h-4 text-dark-900 mr-2" />
                CONTINUE WITH GOOGLE
              </SpecularButton>
            )}

            <button
              onClick={() => {
                setShowDemoUsedModal(false);
                setActiveTab('landing');
              }}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs tracking-wider uppercase bg-dark-800 hover:bg-dark-700 text-slate-300 border border-white/10 flex items-center justify-center gap-2 transition-all font-mono"
            >
              <ArrowLeft className="w-4 h-4" />
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. ADMIN PORTAL ROUTES (Requirements 10 - 14)
  if (activeTab === 'admin-login') {
    return (
      <AdminLoginPage
        onSuccess={() => setActiveTab('admin-dashboard')}
        onGoHome={() => setActiveTab('landing')}
      />
    );
  }

  if (activeTab === 'admin-dashboard') {
    if (!isAdminAuthenticated) {
      return (
        <AdminLoginPage
          onSuccess={() => setActiveTab('admin-dashboard')}
          onGoHome={() => setActiveTab('landing')}
        />
      );
    }
    return (
      <AdminDashboardPage
        onGoHome={() => setActiveTab('landing')}
        onLaunchTestApp={() => setActiveTab('dashboard')}
      />
    );
  }

  // 3. STATIC 70-QUESTION DEMO INTERVIEW ROOM VIEW
  if (activeTab === 'demo-room') {
    return (
      <DemoInterviewPage
        onFinishDemo={(data) => {
          setDemoSummaryData(data);
        }}
        onGoToDashboard={(data) => {
          setDemoSummaryData(data);
          setActiveTab('demo-dashboard');
        }}
        onGoHome={() => setActiveTab('landing')}
        onContinueGoogle={() => {
          setLoginMode('login');
          setActiveTab('login');
        }}
      />
    );
  }

  // 4. STATIC DEMO DASHBOARD PREVIEW VIEW
  if (activeTab === 'demo-dashboard') {
    return (
      <DemoDashboardPage
        demoSummary={demoSummaryData}
        onLoginClick={() => {
          setLoginMode('login');
          setActiveTab('login');
        }}
        onRetakeDemo={() => handleStartDemo()}
        onGoHome={() => setActiveTab('landing')}
      />
    );
  }

  // 5. UNAUTHENTICATED LANDING, LOGIN & SIGNUP VIEWS
  if (!isAuthenticated && !isAdminAuthenticated) {
    if (activeTab === 'login') {
      return (
        <LoginPage
          initialMode={loginMode}
          onSuccess={() => setActiveTab('dashboard')}
          onStartDemo={handleStartDemo}
          onGoHome={() => setActiveTab('landing')}
        />
      );
    }

    return (
      <LandingPage
        onStart={(tab) => setActiveTab(tab)}
        onLogin={() => {
          setLoginMode('login');
          setActiveTab('login');
        }}
        onSignUp={() => {
          setLoginMode('signup');
          setActiveTab('login');
        }}
        onStartDemo={handleStartDemo}
        onAdminLogin={() => setActiveTab('admin-login')}
      />
    );
  }

  // 6. AUTHENTICATED USER INTERVIEW ROOM VIEW
  if (activeTab === 'room' && activeSessionId) {
    return (
      <InterviewRoomPage
        sessionId={activeSessionId}
        onFinish={(report) => {
          setFinalReportData(report);
          setActiveTab('report');
        }}
      />
    );
  }

  // 7. AUTHENTICATED USER FINAL REPORT VIEW
  if (activeTab === 'report' && finalReportData) {
    return (
      <FinalReportPage
        report={finalReportData}
        onRestart={() => setActiveTab('interview')}
      />
    );
  }

  // 8. AUTHENTICATED DASHBOARD LAYOUT
  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 flex flex-col lg:flex-row min-w-0 font-sans">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onOpenAssistant={() => setAssistantDrawerOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Navbar
          activeTab={activeTab}
          setSidebarOpen={setSidebarOpen}
          onOpenAssistant={() => setAssistantDrawerOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardPage onNavigate={setActiveTab} />}
          {activeTab === 'resume' && <AtsPage />}
          {activeTab === 'interview' && (
            <InterviewPrepPage
              onStartSession={(id) => {
                setActiveSessionId(id);
                setActiveTab('room');
              }}
            />
          )}
          {activeTab === 'research' && <CompanyResearchPage />}
          {activeTab === 'learning' && <LearningRoadmapPage />}
          {activeTab === 'progress' && <ProgressAnalyticsPage />}
          {activeTab === 'questions' && <QuestionVaultPage />}
          {activeTab === 'chat' && <ChatbotPage />}
          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Global Floating AI Career Assistant Drawer */}
      <AICareerAssistantDrawer
        isOpen={assistantDrawerOpen}
        onClose={() => setAssistantDrawerOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <AuthProvider>
      {showIntro ? (
        <IntroSequence onComplete={() => setShowIntro(false)} />
      ) : (
        <MainAppContent />
      )}
    </AuthProvider>
  );
};

export default App;
