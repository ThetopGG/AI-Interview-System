export interface Role {
  id: string;
  title: string;
  description: string;
}

export interface QuestionAnswer {
  id: string;
  order_index: number;
  question_text: string;
  answer_text: string | null;
}

export interface InterviewSession {
  id: string;
  candidate_id: string;
  resume_id: string;
  role_id: string;
  status: string;
  created_at: string;
  questions: QuestionAnswer[];
}

export interface NextQuestionResponse {
  session_id: string;
  question: QuestionAnswer | null;
  is_complete: boolean;
}

export interface InterviewSummary {
  id: string;
  session_id: string;
  overall_score: number | null;
  strengths: string | null;
  weaknesses: string | null;
  summary_text: string;
  created_at: string;
}
