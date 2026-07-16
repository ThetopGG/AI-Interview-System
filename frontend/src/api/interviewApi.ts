import apiClient from "./axiosClient";
import type {
  InterviewSession,
  NextQuestionResponse,
  QuestionAnswer,
} from "../types/interview";

export async function startInterview(
  resumeId: string,
  roleId: string
): Promise<InterviewSession> {
  const response = await apiClient.post<InterviewSession>("/interview/start", {
    resume_id: resumeId,
    role_id: roleId,
  });
  return response.data;
}

export async function fetchNextQuestion(sessionId: string): Promise<NextQuestionResponse> {
  const response = await apiClient.post<NextQuestionResponse>(
    `/interview/${sessionId}/next-question`
  );
  return response.data;
}

export async function submitAnswer(
  sessionId: string,
  questionId: string,
  answerText: string
): Promise<QuestionAnswer> {
  const response = await apiClient.post<QuestionAnswer>(`/interview/${sessionId}/answer`, {
    question_id: questionId,
    answer_text: answerText,
  });
  return response.data;
}

export async function completeInterview(sessionId: string): Promise<InterviewSession> {
  const response = await apiClient.post<InterviewSession>(`/interview/${sessionId}/complete`);
  return response.data;
}

export async function getInterviewSession(sessionId: string): Promise<InterviewSession> {
  const response = await apiClient.get<InterviewSession>(`/interview/${sessionId}`);
  return response.data;
}
