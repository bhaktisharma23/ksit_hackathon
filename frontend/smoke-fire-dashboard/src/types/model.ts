export type ModelStatus = "active" | "inactive" | "training";

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  mAP: number;
}

export interface AIModel {
  id: string;
  name: string;
  version: string;
  framework: string;
  classes: string[];
  metrics: ModelMetrics;
  status: ModelStatus;
}