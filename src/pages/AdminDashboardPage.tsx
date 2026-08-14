import React, { useState, useEffect } from 'react';
import { 
  Users, Sparkles, Video, FileText, 
  RefreshCw, Home, Menu, Activity, Building2, Map, 
  MessageSquare, Server, Settings as SettingsIcon, Play, AlertTriangle,
  CheckCircle2, XCircle
} from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AdminSidebar } from '../components/layout/AdminSidebar';
import type { AdminTabType } from '../components/layout/AdminSidebar';

interface AdminDashboardPageProps {
  onGoHome: () => void;
  onLaunchTestApp: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ 
  onGoHome,
  onLaunchTestApp 
}) => {
  const { logoutAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTabType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Tab Data States
  const [overviewData, setOverviewData] = useState<any>(null);
  const [usersData, setUsersData] = useState<any>(null);
  const [activityData, setActivityData] = useState<any>(null);
  const [companiesData, setCompaniesData] = useState<any>(null);
  const [interviewsData, setInterviewsData] = useState<any>(null);
  const [atsData, setAtsData] = useState<any>(null);
  const [roadmapsData, setRoadmapsData] = useState<any>(null);
  const [chatbotData, setChatbotData] = useState<any>(null);
  const [systemStatusData, setSystemStatusData] = useState<any>(null);

  const fetchTabData = async (tab: AdminTabType) => {
    setIsLoading(true);
    try {
      if (tab === 'overview') {
        const res = await apiService.getAdminOverview();
        setOverviewData(res);
      } else if (tab === 'users') {
        const res = await apiService.getAdminUsers();
        setUsersData(res);
      } else if (tab === 'activity') {
        const res = await apiService.getAdminActivity();
        setActivityData(res);
      } else if (tab === 'companies') {
        const res = await apiService.getAdminCompanies();
        setCompaniesData(res);
      } else if (tab === 'interviews') {
        const res = await apiService.getAdminInterviews();
        setInterviewsData(res);
      } else if (tab === 'ats') {
        const res = await apiService.getAdminAts();
        setAtsData(res);
      } else if (tab === 'roadmaps') {
        const res = await apiService.getAdminRoadmaps();
        setRoadmapsData(res);
      } else if (tab === 'chatbot') {
        const res = await apiService.getAdminChatbot();
        setChatbotData(res);
      } else if (tab === 'system-status') {
        const res = await apiService.getAdminSystemStatus();
        setSystemStatusData(res);
      }
    } catch (e) {
      console.error(`Error fetching tab ${tab}:`, e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTabData(activeTab);
  }, [activeTab]);

  const handleLogout = () => {
    logoutAdmin();
    onGoHome();
  };

  // Helper banner for disconnected DB state
  const DatabaseNotConnectedBanner = ({ message }: { message?: string }) => (
    <div className="glass-panel p-6 border-amber-500/40 bg-amber-500/10 flex items-start gap-4">
      <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
      <div className="space-y-1">
        <h4 className="font-bold text-amber-300 text-sm tracking-wide uppercase font-mono">
          Database Connection State: Unconfigured
        </h4>
        <p className="text-slate-300 text-xs font-sans leading-relaxed">
          {message || 'Supabase PostgreSQL is currently unconfigured or offline. Live database monitoring views require active Supabase credentials.'}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 flex min-w-0 font-sans">
      {/* Dedicated Admin Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onTestApplication={onLaunchTestApp}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Admin Header Navbar */}
        <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-dark-900/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white p-2 rounded-lg bg-white/5"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="eyebrow-pill text-[10px]">
                <span className="dot-purple" />
                <span>Backend-Validated Security</span>
              </div>
              <h1 className="text-xl font-black font-display text-white uppercase tracking-wider">
                {activeTab.replace('-', ' ')}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchTabData(activeTab)}
              className="px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-amber-300 border border-white/10 text-xs font-bold font-mono flex items-center gap-2 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={onLaunchTestApp}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold text-xs font-mono flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-dark-950" />
              <span className="hidden sm:inline">Test App</span>
            </button>

            <button
              onClick={onGoHome}
              className="px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 border border-white/10 text-xs font-bold font-mono flex items-center gap-2 transition-all"
            >
              <Home className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Landing Page</span>
            </button>
          </div>
        </header>

        {/* Tab View Container */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {overviewData && !overviewData.is_supabase_connected && (
                <DatabaseNotConnectedBanner message={overviewData.message} />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-panel p-6 space-y-2 border-l-4 border-l-amber-500">
                  <div className="flex justify-between items-center text-slate-400 text-xs font-mono font-bold uppercase">
                    <span>Total Users</span>
                    <Users className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="text-3xl font-black font-mono text-white">
                    {overviewData?.metrics?.total_users ?? (overviewData?.is_supabase_connected ? 0 : 'N/A')}
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">Registered candidate profiles.</p>
                </div>

                <div className="glass-panel p-6 space-y-2 border-l-4 border-l-cyan-500">
                  <div className="flex justify-between items-center text-slate-400 text-xs font-mono font-bold uppercase">
                    <span>Total Interviews</span>
                    <Video className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="text-3xl font-black font-mono text-white">
                    {overviewData?.metrics?.total_interviews ?? (overviewData?.is_supabase_connected ? 0 : 'N/A')}
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">Mock sessions conducted.</p>
                </div>

                <div className="glass-panel p-6 space-y-2 border-l-4 border-l-blue-500">
                  <div className="flex justify-between items-center text-slate-400 text-xs font-mono font-bold uppercase">
                    <span>ATS Audits</span>
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-3xl font-black font-mono text-white">
                    {overviewData?.metrics?.total_ats_analyses ?? (overviewData?.is_supabase_connected ? 0 : 'N/A')}
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">Resume analyses completed.</p>
                </div>

                <div className="glass-panel p-6 space-y-2 border-l-4 border-l-emerald-500">
                  <div className="flex justify-between items-center text-slate-400 text-xs font-mono font-bold uppercase">
                    <span>Avg Interview Score</span>
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-black font-mono text-white">
                    {overviewData?.metrics?.average_interview_score ? `${overviewData.metrics.average_interview_score}%` : 'N/A'}
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">Platform candidate performance.</p>
                </div>
              </div>
            </div>
          )}

          {/* 2. USERS TAB */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {usersData && !usersData.is_supabase_connected && (
                <DatabaseNotConnectedBanner />
              )}

              <div className="glass-panel overflow-hidden">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm font-mono uppercase tracking-wider">
                    Registered Candidate Directory
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    Total: {usersData?.users?.length || 0}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-white/5 text-slate-400 border-b border-white/10">
                      <tr>
                        <th className="py-3 px-4">User / Email</th>
                        <th className="py-3 px-4">User ID</th>
                        <th className="py-3 px-4">Interviews</th>
                        <th className="py-3 px-4">ATS Audits</th>
                        <th className="py-3 px-4">Demo Used</th>
                        <th className="py-3 px-4">Last Activity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {usersData?.users && usersData.users.length > 0 ? (
                        usersData.users.map((u: any, idx: number) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="py-3 px-4 text-white font-bold">{u.name || u.email || 'Anonymous Candidate'}</td>
                            <td className="py-3 px-4 text-slate-400 truncate max-w-[150px]">{u.user_id}</td>
                            <td className="py-3 px-4 text-cyan-300 font-bold">{u.interviews_count}</td>
                            <td className="py-3 px-4 text-blue-300 font-bold">{u.ats_count}</td>
                            <td className="py-3 px-4">
                              {u.demo_used ? (
                                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                                  YES
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-slate-500/20 text-slate-400 text-[10px]">
                                  NO
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-slate-400">
                              {u.last_activity ? new Date(u.last_activity).toLocaleDateString() : 'N/A'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-500 italic font-sans">
                            {usersData?.is_supabase_connected ? 'No user profiles found in database.' : 'Database not connected'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. USER ACTIVITY TAB */}
          {activeTab === 'activity' && (
            <div className="space-y-6">
              {activityData && !activityData.is_supabase_connected && (
                <DatabaseNotConnectedBanner />
              )}

              <div className="glass-panel p-6 space-y-4">
                <h3 className="font-bold text-white text-sm font-mono uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400" /> Recent User Activity Stream
                </h3>

                <div className="space-y-3">
                  {activityData?.activities && activityData.activities.length > 0 ? (
                    activityData.activities.map((act: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-amber-300 font-mono">{act.activity_type}</div>
                          <div className="text-xs text-slate-300 font-sans">{act.details}</div>
                          <div className="text-[10px] text-slate-500 font-mono">User ID: {act.user_id}</div>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono shrink-0">
                          {act.timestamp ? new Date(act.timestamp).toLocaleString() : ''}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-slate-500 italic font-sans">
                      {activityData?.is_supabase_connected ? 'No activity records found.' : 'Database not connected'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 4. COMPANIES & RESEARCH TAB */}
          {activeTab === 'companies' && (
            <div className="space-y-6">
              {companiesData && !companiesData.is_supabase_connected && (
                <DatabaseNotConnectedBanner />
              )}

              <div className="glass-panel p-6 space-y-4">
                <h3 className="font-bold text-white text-sm font-mono uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-400" /> Researched Companies & Target Roles
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {companiesData?.researched_companies && companiesData.researched_companies.length > 0 ? (
                    companiesData.researched_companies.map((c: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                        <div className="text-sm font-bold text-white">{c.company}</div>
                        <div className="text-xs text-amber-400 font-mono">{c.role}</div>
                        <div className="text-[10px] text-slate-400 font-mono pt-2 border-t border-white/5 flex justify-between">
                          <span>Searches: {c.search_count}</span>
                          <span>{c.updated_at ? new Date(c.updated_at).toLocaleDateString() : ''}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center text-slate-500 italic font-sans">
                      {companiesData?.is_supabase_connected ? 'No company research records found.' : 'Database not connected'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 5. INTERVIEWS TAB */}
          {activeTab === 'interviews' && (
            <div className="space-y-6">
              {interviewsData && !interviewsData.is_supabase_connected && (
                <DatabaseNotConnectedBanner />
              )}

              <div className="glass-panel p-6 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-bold text-white text-sm font-mono uppercase tracking-wider flex items-center gap-2">
                      <Video className="w-4 h-4 text-cyan-400" /> Interview Sessions Monitor
                    </h3>
                    <p className="text-xs text-slate-400">Live candidate interview evaluations.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-mono uppercase block">Avg Score</span>
                    <span className="text-2xl font-black font-mono text-amber-400">
                      {interviewsData?.average_score ? `${interviewsData.average_score}%` : 'N/A'}
                    </span>
                  </div>
                </div>

                {interviewsData?.top_weak_skills && (
                  <div className="space-y-2">
                    <span className="text-xs font-mono text-slate-400 uppercase">Aggregated Weak Skill Trends:</span>
                    <div className="flex flex-wrap gap-2">
                      {interviewsData.top_weak_skills.map((skill: string, sIdx: number) => (
                        <span key={sIdx} className="px-3 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold">
                          ⚠️ {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 6. ATS TAB */}
          {activeTab === 'ats' && (
            <div className="space-y-6">
              {atsData && !atsData.is_supabase_connected && (
                <DatabaseNotConnectedBanner />
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 space-y-2 border-l-4 border-l-blue-500">
                  <span className="text-xs text-slate-400 font-mono uppercase font-bold">Total ATS Audits</span>
                  <div className="text-3xl font-black font-mono text-white">
                    {atsData?.stats?.total ?? (atsData?.is_supabase_connected ? 0 : 'N/A')}
                  </div>
                </div>

                <div className="glass-panel p-6 space-y-2 border-l-4 border-l-emerald-500">
                  <span className="text-xs text-slate-400 font-mono uppercase font-bold">Average ATS Score</span>
                  <div className="text-3xl font-black font-mono text-emerald-400">
                    {atsData?.stats?.average_score ? `${atsData.stats.average_score}%` : 'N/A'}
                  </div>
                </div>

                <div className="glass-panel p-6 space-y-2 border-l-4 border-l-purple-500">
                  <span className="text-xs text-slate-400 font-mono uppercase font-bold">Highest Audit Score</span>
                  <div className="text-3xl font-black font-mono text-purple-400">
                    {atsData?.stats?.highest_score ? `${atsData.stats.highest_score}%` : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. ROADMAPS TAB */}
          {activeTab === 'roadmaps' && (
            <div className="space-y-6">
              {roadmapsData && !roadmapsData.is_supabase_connected && (
                <DatabaseNotConnectedBanner />
              )}

              <div className="glass-panel p-6 space-y-4">
                <h3 className="font-bold text-white text-sm font-mono uppercase tracking-wider flex items-center gap-2">
                  <Map className="w-4 h-4 text-emerald-400" /> Targeted Career Roadmaps
                </h3>
                <p className="text-xs text-slate-400">
                  {roadmapsData?.is_supabase_connected 
                    ? `Generated Roadmaps Count: ${roadmapsData?.roadmaps?.length || 0}`
                    : 'Database not connected'}
                </p>
              </div>
            </div>
          )}

          {/* 8. CHATBOT TAB */}
          {activeTab === 'chatbot' && (
            <div className="space-y-6">
              {chatbotData && !chatbotData.is_supabase_connected && (
                <DatabaseNotConnectedBanner />
              )}

              <div className="glass-panel p-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-sm font-mono uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-purple-400" /> Chatbot Usage Statistics (Privacy Preserved)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Tracks topic frequency and conversation totals without storing or exposing private chat text.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <span className="text-xs font-mono text-slate-400 uppercase">Total AI Conversations</span>
                    <div className="text-4xl font-black font-mono text-purple-400">
                      {chatbotData?.total_conversations ?? 0}
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <span className="text-xs font-mono text-slate-400 uppercase">Popular Conversation Topics</span>
                    <div className="flex flex-wrap gap-2">
                      {chatbotData?.popular_topics && chatbotData.popular_topics.length > 0 ? (
                        chatbotData.popular_topics.map((t: string, idx: number) => (
                          <span key={idx} className="px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold">
                            💬 {t}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500 italic">No conversation topics logged.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 9. SYSTEM STATUS TAB */}
          {activeTab === 'system-status' && (
            <div className="space-y-6">
              <div className="glass-panel p-6 space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-sm font-mono uppercase tracking-wider flex items-center gap-2">
                    <Server className="w-4 h-4 text-emerald-400" /> Core Integration Health Monitor
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live health verification of system services without leaking API secrets or keys.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                  {systemStatusData?.services ? (
                    systemStatusData.services.map((srv: any, idx: number) => (
                      <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white text-sm">{srv.name}</span>
                          {srv.is_active ? (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> CONNECTED
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> NOT CONFIGURED
                            </span>
                          )}
                        </div>

                        {srv.version && (
                          <div className="text-xs font-mono text-slate-400">
                            Version: <span className="text-slate-200">{srv.version}</span>
                          </div>
                        )}

                        {srv.model && (
                          <div className="text-xs font-mono text-slate-400 truncate">
                            Model: <span className="text-amber-400">{srv.model}</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center text-slate-500 italic">
                      Loading system status metrics...
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 10. SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="glass-panel p-6 space-y-6 max-w-2xl">
                <div className="space-y-2 border-b border-white/10 pb-4">
                  <h3 className="font-bold text-white text-sm font-mono uppercase tracking-wider flex items-center gap-2">
                    <SettingsIcon className="w-4 h-4 text-amber-400" /> Admin Security Configuration
                  </h3>
                  <p className="text-xs text-slate-400">
                    HireMate Admin Portal Security Policies & Control Settings.
                  </p>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-slate-400 uppercase">Authentication Mode</span>
                    <div className="text-amber-400 font-bold">FastAPI Environment Variable JWT Validation</div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-slate-400 uppercase">Hardcoded Password Status</span>
                    <div className="text-emerald-400 font-bold">ZERO Hardcoded Passwords in Frontend JS</div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-slate-400 uppercase">Demo Separation</span>
                    <div className="text-cyan-400 font-bold">100% Isolated Demo (No Admin Backdoors)</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
