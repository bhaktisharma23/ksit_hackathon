import { apiClient } from "./api";
import { USE_MOCK_DATA } from "../utils/constants";
import { mockGetDetections, mockGetDetectionSummary } from "../mock/detectionMock";
import type { Detection, DetectionSummary } from "../types/detection";

export async function getDetections(videoId: string): Promise<Detection[]> {
  if (USE_MOCK_DATA) {
    return mockGetDetections(videoId);
  }

  const response = await apiClient.get<Detection[]>(`/videos/${videoId}/detections`);
  return response.data;
}

export async function getDetectionSummary(): Promise<DetectionSummary> {
  if (USE_MOCK_DATA) {
    return mockGetDetectionSummary();
  }

  const response = await apiClient.get<DetectionSummary>("/detections/summary");
  return response.data;
}