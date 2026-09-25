import { apiClient } from "./api";
import { USE_MOCK_DATA } from "../utils/constants";
import { mockGetAlerts, mockUpdateAlertStatus } from "../mock/alertMock";
import type { Alert, AlertFilters, AlertStatus } from "../types/alert";

export async function getAlerts(filters?: AlertFilters): Promise<Alert[]> {
  if (USE_MOCK_DATA) {
    return mockGetAlerts(filters);
  }

  const response = await apiClient.get<Alert[]>("/alerts", { params: filters });
  return response.data;
}

export async function getAlert(alertId: string): Promise<Alert> {
  const response = await apiClient.get<Alert>(`/alerts/${alertId}`);
  return response.data;
}

export async function updateAlertStatus(alertId: string, status: AlertStatus): Promise<Alert> {
  if (USE_MOCK_DATA) {
    return mockUpdateAlertStatus(alertId, status);
  }

  const response = await apiClient.patch<Alert>(`/alerts/${alertId}`, { status });
  return response.data;
}