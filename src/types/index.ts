export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  google_id?: string;
}

export interface ATSBreakdown {
  keyword_match: number;
  required_skills: number;
  role_relevance: number;
  experience: number;
  projects: number;
  education: number;
  formatting: number;
}

export interface MissingSkill {
  skill_name: string;
  importance: 'Critical' | 'High' | 'Medium' | 'Low';
  classification: 'Required' | 'Preferred';
  why_it_matters: string;
  where_it_appears: string;
  how_to_improve: string;
}

export interface WritingImprovement {
  section: string;
  original: string;
  improved: string;
  reason: string;
}

export interface FreeResource {
  skill_name: string;
  why_needed: string;
  resource_title: string;
  resource_url: string;
  difficulty: string;
  source_name: string;
}

export interface ATSAnalysisData {
  id: string;
  resume_id: string;
  overall_score: number;
  breakdown: ATSBreakdown;
  missing_skills: MissingSkill[];
  missing_keywords: string[];
  writing_improvements: WritingImprovement[];
  free_resources: FreeResource[];
  created_at: string;
}

export interface StageConfigItem {
  name: string;
  type: 'Aptitude' | 'Technical' | 'Coding' | 'HR';
  question_count: number;
  status: string;
}

export interface CompanyResearch {
  company: string;
  role: string;
  interview_stages: string[];
  stage_configuration?: StageConfigItem[];
  common_topics: string[];
  public_questions: Array<{
    round: string;
    question: string;
    topic: string;
    source_type: string;
    source_url?: string;
  }>;
  role_requirements: string[];
  sources: Array<{
    title: string;
    url: string;
    source_type: string;
  }>;
  updated_at: string;
  is_fresh: boolean;
}

export interface QuestionItem {
  id: string;
  session_id: string;
  round_type: 'Aptitude' | 'Technical' | 'Coding' | 'HR';
  question_text: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  source_type: string;
  source_url?: string;
  code_template?: string;
  coding_constraints?: string;
  options?: string[];
  order_index: number;
  answered?: boolean;
  user_answer?: string;
  score?: number;
  evaluation?: {
    score: number;
    correctness: string;
    relevance: string;
    technical_depth: string;
    feedback: string;
    suggestions: string;
    follow_up_question?: string;
  };
  current_stage_index?: number;
  current_stage_name?: string;
  current_stage_type?: string;
  questions_completed_in_stage?: number;
  stage_question_count?: number;
  total_questions_completed?: number;
  interview_completed?: boolean;
}

export interface FinalReport {
  session_id: string;
  company: string;
  role: string;
  overall_score: number;
  round_scores: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  struggled_questions: Array<{
    question: string;
    round: string;
    score: number;
    feedback: string;
  }>;
  resume_vulnerabilities: string[];
  readiness_level: string;
  recommended_resources: FreeResource[];
  is_demo?: boolean;
  questions_with_answers?: Array<{
    question_id?: string;
    question_text: string;
    round_type: string;
    stage_name?: string;
    topic: string;
    status?: 'answered' | 'unanswered';
    evaluation_label?: string;
    score: number;
    user_answer?: string;
    correct_option?: string;
    feedback?: string;
    suggestions?: string;
  }>;
  correct_answers_count?: number;
  incorrect_answers_count?: number;
  total_questions_count?: number;
  answered_count?: number;
  unanswered_count?: number;
  strong_answers_count?: number;
  acceptable_answers_count?: number;
  weak_answers_count?: number;
  stage_breakdown?: Array<{
    stage_name: string;
    round_type: string;
    total_questions: number;
    answered_count: number;
    unanswered_count: number;
    correct_count: number;
    incorrect_count: number;
    strong_count: number;
    acceptable_count: number;
    weak_count: number;
    stage_score: number;
  }>;
  demo_roadmap?: string[];
  demo_skill_gap?: string[];
}

export interface LearningRoadmapItem {
  id: string;
  skill_name: string;
  category: string;
  priority: string;
  resource_title: string;
  resource_url: string;
  difficulty: string;
  source_name: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  roadmap_week: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface DashboardData {
  user_profile: UserProfile;
  ats_card: {
    score: number | null;
    max: number;
    delta_text?: string | null;
    breakdown: ATSBreakdown | null;
  };
  interview_card: {
    readiness: number | null;
    max: number;
    delta_text?: string | null;
    breakdown: {
      aptitude: number | null;
      technical: number | null;
      hr: number | null;
    } | null;
  };
  recent_interview: {
    session_id?: string;
    company: string;
    role: string;
    score: number;
    aptitude_score?: number;
    technical_score?: number;
    coding_score?: number;
    hr_score?: number;
    date: string;
  } | null;
  total_questions_answered?: number;
  progress_trends: {
    labels: string[];
    ats_progress: number[];
    interview_progress: number[];
    technical_progress: number[];
    aptitude_progress: number[];
    hr_progress: number[];
  };
  weak_skills: string[];
  total_interviews_taken: number;
}
