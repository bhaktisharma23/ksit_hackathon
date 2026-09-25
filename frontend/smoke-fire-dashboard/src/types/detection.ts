export type DetectionClass = "smoke" | "fire";

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Detection {
  id: string;
  className: DetectionClass;
  confidence: number;
  timestamp: number;
  boundingBox: BoundingBox;
}

export interface DetectionSummary {
  totalDetections: number;
  fireCount: number;
  smokeCount: number;
  averageConfidenceFire: number;
  averageConfidenceSmoke: number;
}