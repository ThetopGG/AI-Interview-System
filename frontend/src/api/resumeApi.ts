import apiClient from "./axiosClient";
import type { ResumeUploadResponse } from "../types/resume";

export async function uploadResume(
  name: string,
  email: string | undefined,
  file: File
): Promise<ResumeUploadResponse> {
  const formData = new FormData();
  formData.append("name", name);
  if (email) {
    formData.append("email", email);
  }
  formData.append("file", file);

  const response = await apiClient.post<ResumeUploadResponse>("/resume/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}
