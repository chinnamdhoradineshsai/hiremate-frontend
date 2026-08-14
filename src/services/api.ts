import type { 
  ATSAnalysisData, CompanyResearch, 
  FinalReport, LearningRoadmapItem, DashboardData, QuestionItem 
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://hiremate-backend-production-c51f.up.railway.app/api/v1';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('hiremate_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('hiremate_token', token);
  }

  getToken() {
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('hiremate_token');
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async googleLogin(googleData: { access_token?: string; id_token?: string; google_id?: string; email?: string; name?: string; avatar_url?: string }) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (googleData.access_token) {
      headers['Authorization'] = `Bearer ${googleData.access_token}`;
    } else if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    const resp = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers,
      body: JSON.stringify(googleData)
    });
    if (resp.ok) {
      const data = await resp.json();
      this.setToken(data.access_token);
      return data;
    }
    const err = await resp.json().catch(() => ({ detail: 'Profile synchronization failed.' }));
    throw new Error(err.detail || 'Profile synchronization error.');
  }

  async demoLogin() {
    window.location.hash = '#demo';
    return { status: 'static_demo' };
  }

  async adminLogin(username: string, password: string) {
    const resp = await fetch(`${API_BASE_URL}/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (resp.ok) {
      const data = await resp.json();
      this.setToken(data.access_token);
      return data;
    }
    const err = await resp.json().catch(() => ({ detail: 'Access denied. Invalid admin credentials.' }));
    throw new Error(err.detail || 'Access denied. Invalid admin credentials.');
  }

  async getAdminStats() {
    const resp = await fetch(`${API_BASE_URL}/auth/admin/stats`, {
      headers: this.getHeaders()
    });
    if (resp.ok) {
      return await resp.json();
    }
    const err = await resp.json().catch(() => ({ detail: 'Failed to retrieve admin stats.' }));
    throw new Error(err.detail || 'Admin access denied.');
  }

  async associateDemoSession(demoSessionId?: string) {
    const resp = await fetch(`${API_BASE_URL}/auth/associate-demo`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ demo_session_id: demoSessionId })
    });
    if (resp.ok) {
      return await resp.json();
    }
    return { demo_used: true };
  }

  async getAdminOverview() {
    const resp = await fetch(`${API_BASE_URL}/admin/overview`, { headers: this.getHeaders() });
    if (resp.ok) return await resp.json();
    return { is_supabase_connected: false, message: 'Database not connected', metrics: null };
  }

  async getAdminUsers() {
    const resp = await fetch(`${API_BASE_URL}/admin/users`, { headers: this.getHeaders() });
    if (resp.ok) return await resp.json();
    return { is_supabase_connected: false, users: [] };
  }

  async getAdminActivity() {
    const resp = await fetch(`${API_BASE_URL}/admin/activity`, { headers: this.getHeaders() });
    if (resp.ok) return await resp.json();
    return { is_supabase_connected: false, activities: [] };
  }

  async getAdminCompanies() {
    const resp = await fetch(`${API_BASE_URL}/admin/companies`, { headers: this.getHeaders() });
    if (resp.ok) return await resp.json();
    return { is_supabase_connected: false, researched_companies: [] };
  }

  async getAdminInterviews() {
    const resp = await fetch(`${API_BASE_URL}/admin/interviews`, { headers: this.getHeaders() });
    if (resp.ok) return await resp.json();
    return { is_supabase_connected: false, interviews: [], average_score: null, top_weak_skills: [] };
  }

  async getAdminAts() {
    const resp = await fetch(`${API_BASE_URL}/admin/ats`, { headers: this.getHeaders() });
    if (resp.ok) return await resp.json();
    return { is_supabase_connected: false, ats_analyses: [], stats: null };
  }

  async getAdminRoadmaps() {
    const resp = await fetch(`${API_BASE_URL}/admin/roadmaps`, { headers: this.getHeaders() });
    if (resp.ok) return await resp.json();
    return { is_supabase_connected: false, roadmaps: [] };
  }

  async getAdminChatbot() {
    const resp = await fetch(`${API_BASE_URL}/admin/chatbot`, { headers: this.getHeaders() });
    if (resp.ok) return await resp.json();
    return { is_supabase_connected: false, total_conversations: 0, popular_topics: [] };
  }

  async getAdminSystemStatus() {
    const resp = await fetch(`${API_BASE_URL}/admin/system-status`, { headers: this.getHeaders() });
    if (resp.ok) return await resp.json();
    return { services: [] };
  }



  async analyzeResume(formData: FormData): Promise<ATSAnalysisData> {
    const resp = await fetch(`${API_BASE_URL}/resume/analyze`, {
      method: 'POST',
      headers: this.token ? { 'Authorization': `Bearer ${this.token}` } : {},
      body: formData
    });

    if (resp.ok) {
      return await resp.json();
    }
    const err = await resp.json().catch(() => ({ detail: 'Resume analysis failed.' }));
    throw new Error(err.detail || 'Resume analysis failed. Please check your file or try again.');
  }

  async fetchResearch(company: string, role: string): Promise<CompanyResearch> {
    const resp = await fetch(`${API_BASE_URL}/research?company=${encodeURIComponent(company)}&role=${encodeURIComponent(role)}`, {
      headers: this.getHeaders()
    });
    if (resp.ok) {
      return await resp.json();
    }
    const err = await resp.json().catch(() => ({ detail: 'Company research failed.' }));
    throw new Error(err.detail || `Unable to research ${company}. Please retry.`);
  }

  async getDemoStatus(): Promise<{ demo_used: boolean }> {
    const resp = await fetch(`${API_BASE_URL}/interview/demo-status`, {
      headers: this.getHeaders()
    });
    if (resp.ok) {
      return await resp.json();
    }
    return { demo_used: false };
  }

  async prepareInterview(company: string, role: string, mode: string = 'Standard', jobDescription: string = '', resumeId?: string) {
    const resp = await fetch(`${API_BASE_URL}/interview/prepare`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ company, role, mode, job_description: jobDescription, resume_id: resumeId })
    });
    if (resp.ok) {
      return await resp.json();
    }
    const err = await resp.json().catch(() => ({ detail: 'Interview preparation failed.' }));
    throw new Error(err.detail || 'Interview preparation failed. Please retry.');
  }

  async getInterviewSession(sessionId: string) {
    const resp = await fetch(`${API_BASE_URL}/interview/session/${sessionId}`, {
      headers: this.getHeaders()
    });
    if (resp.ok) {
      return await resp.json();
    }
    const err = await resp.json().catch(() => ({ detail: 'Failed to retrieve interview session.' }));
    throw new Error(err.detail || 'Interview session not found.');
  }

  async submitAnswer(questionId: string, answerText?: string, codeSubmission?: string, selectedOptionIndex?: number) {
    const resp = await fetch(`${API_BASE_URL}/interview/submit-answer`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        question_id: questionId,
        answer_text: answerText,
        code_submission: codeSubmission,
        selected_option_index: selectedOptionIndex
      })
    });
    if (resp.ok) {
      return await resp.json();
    }
    const err = await resp.json().catch(() => ({ detail: 'Answer evaluation failed.' }));
    throw new Error(err.detail || 'Answer evaluation failed. Please click Retry.');
  }

  async generateNextAdaptiveQuestion(sessionId: string): Promise<QuestionItem> {
    const resp = await fetch(`${API_BASE_URL}/interview/next-question`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ session_id: sessionId })
    });
    if (resp.ok) {
      return await resp.json();
    }
    const err = await resp.json().catch(() => ({ detail: 'Failed to generate adaptive question.' }));
    throw new Error(err.detail || 'Could not generate adaptive question.');
  }

  async finishInterview(sessionId: string): Promise<FinalReport> {
    const resp = await fetch(`${API_BASE_URL}/interview/finish/${sessionId}`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    if (resp.ok) {
      return await resp.json();
    }
    const err = await resp.json().catch(() => ({ detail: 'Final report generation failed.' }));
    throw new Error(err.detail || 'Could not finalize report. Please retry.');
  }

  async chatAssistant(message: string, history: any[] = []): Promise<{ reply: string; suggested_actions: string[] }> {
    const resp = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ message, history })
    });
    if (resp.ok) {
      return await resp.json();
    }
    const err = await resp.json().catch(() => ({ detail: 'Chat assistant unavailable.' }));
    throw new Error(err.detail || 'Chat assistant error. Please retry.');
  }

  async getDashboardAnalytics(): Promise<DashboardData> {
    const resp = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
      headers: this.getHeaders()
    });
    if (resp.ok) {
      return await resp.json();
    }
    const err = await resp.json().catch(() => ({ detail: 'Failed to load dashboard analytics.' }));
    throw new Error(err.detail || 'Dashboard data error. Please retry.');
  }

  async getLearningRoadmap(): Promise<LearningRoadmapItem[]> {
    const resp = await fetch(`${API_BASE_URL}/learning`, {
      headers: this.getHeaders()
    });
    if (resp.ok) {
      const data = await resp.json();
      return data.roadmap;
    }
    const err = await resp.json().catch(() => ({ detail: 'Failed to load learning roadmap.' }));
    throw new Error(err.detail || 'Learning roadmap error.');
  }

  async toggleLearningStatus(id: string) {
    const resp = await fetch(`${API_BASE_URL}/learning/toggle/${id}`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    if (resp.ok) {
      return await resp.json();
    }
    const err = await resp.json().catch(() => ({ detail: 'Failed to update learning item.' }));
    throw new Error(err.detail || 'Update failed.');
  }

  async getQuestionVault() {
    const resp = await fetch(`${API_BASE_URL}/questions/vault`, {
      headers: this.getHeaders()
    });
    if (resp.ok) {
      return await resp.json();
    }
    const err = await resp.json().catch(() => ({ detail: 'Failed to retrieve question vault.' }));
    throw new Error(err.detail || 'Question vault error.');
  }
}

export const apiService = new ApiService();
