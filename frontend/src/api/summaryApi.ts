import apiClient from "./axiosClient";
import type { InterviewSummary } from "../types/interview";

export async function generateSummary(sessionId: string): Promise<InterviewSummary> {
  const response = await apiClient.post<InterviewSummary>(`/summary/${sessionId}/generate`);
  return response.data;
}

export async function getSummary(sessionId: string): Promise<InterviewSummary> {
  const response = await apiClient.get<InterviewSummary>(`/summary/${sessionId}`);
  return response.data;
}
