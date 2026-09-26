import { apiClient } from "./api";
import type { Alert } from "../types/alert";
import type { DetectionSummary } from "../types/detection";

export interface DashboardData {
  summary: DetectionSummary;
  videosAnalyzed: number;
  activity: { label: string; fire: number; smoke: number }[];
  alerts: Alert[];
}

export async function getDashboardData(): Promise<DashboardData> {
  const response = await apiClient.get<DashboardData>("/dashboard");
  return response.data;
}