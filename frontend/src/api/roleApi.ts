import apiClient from "./axiosClient";
import type { Role } from "../types/interview";

export async function fetchRoles(): Promise<Role[]> {
  const response = await apiClient.get<Role[]>("/roles/");
  return response.data;
}
