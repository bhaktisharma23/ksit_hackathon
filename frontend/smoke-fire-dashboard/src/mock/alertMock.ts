import type { Alert, AlertFilters, AlertStatus } from "../types/alert";

let alerts: Alert[] = [
  {
    id: "alert-1",
    type: "fire",
    confidence: 0.984,
    timestamp: "2026-09-25T10:32:14Z",
    source: "Warehouse Camera 01",
    status: "active",
  },
  {
    id: "alert-2",
    type: "smoke",
    confidence: 0.921,
    timestamp: "2026-09-25T09:15:41Z",
    source: "Loading Dock Camera 02",
    status: "acknowledged",
  },
  {
    id: "alert-3",
    type: "fire",
    confidence: 0.876,
    timestamp: "2026-09-24T22:04:09Z",
    source: "Warehouse Camera 01",
    status: "resolved",
  },
];

export async function mockGetAlerts(filters?: AlertFilters): Promise<Alert[]> {
  return new Promise((resolve) => {
    let result = alerts;
    if (filters?.type) result = result.filter((a) => a.type === filters.type);
    if (filters?.status) result = result.filter((a) => a.status === filters.status);
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter((a) => a.source.toLowerCase().includes(q));
    }
    setTimeout(() => resolve(result), 300);
  });
}

export async function mockUpdateAlertStatus(alertId: string, status: AlertStatus): Promise<Alert> {
  return new Promise((resolve, reject) => {
    const alert = alerts.find((a) => a.id === alertId);
    if (!alert) {
      reject({ message: "Alert not found" });
      return;
    }
    alert.status = status;
    setTimeout(() => resolve(alert), 200);
  });
}