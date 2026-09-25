import type { DetectionClass } from "./detection";

export type AlertStatus = "active" | "acknowledged" | "resolved";

export interface Alert {
  id: string;
  type: DetectionClass;
  confidence: number;
  timestamp: string;
  source: string;
  status: AlertStatus;
}

export interface AlertFilters {
  type?: DetectionClass;
  status?: AlertStatus;
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
}