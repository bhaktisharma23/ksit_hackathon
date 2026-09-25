import type { Detection, DetectionSummary } from "../types/detection";

const sampleDetections: Detection[] = [
  {
    id: "det-1",
    className: "fire",
    confidence: 0.984,
    timestamp: 45.2,
    boundingBox: { x: 0.42, y: 0.21, width: 0.18, height: 0.32 },
  },
  {
    id: "det-2",
    className: "smoke",
    confidence: 0.921,
    timestamp: 32.0,
    boundingBox: { x: 0.1, y: 0.05, width: 0.25, height: 0.2 },
  },
  {
    id: "det-3",
    className: "fire",
    confidence: 0.876,
    timestamp: 75.4,
    boundingBox: { x: 0.55, y: 0.4, width: 0.15, height: 0.22 },
  },
  {
    id: "det-4",
    className: "smoke",
    confidence: 0.893,
    timestamp: 161.0,
    boundingBox: { x: 0.3, y: 0.1, width: 0.3, height: 0.25 },
  },
];

export async function mockGetDetections(_videoId: string): Promise<Detection[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(sampleDetections), 400);
  });
}

export async function mockGetDetectionSummary(): Promise<DetectionSummary> {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          totalDetections: 142,
          fireCount: 83,
          smokeCount: 59,
          averageConfidenceFire: 0.6664,
          averageConfidenceSmoke: 0.7013,
        }),
      300
    );
  });
}