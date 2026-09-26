import { apiClient } from "./api";
import { USE_MOCK_DATA } from "../utils/constants";
import { mockGetDetections, mockGetDetectionSummary } from "../mock/detectionMock";
import type { Detection, DetectionSummary } from "../types/detection";
import type { VideoMetadata } from "../types/video";

export async function getDetections(videoId: string): Promise<Detection[]> {
  if (USE_MOCK_DATA) {
    return mockGetDetections(videoId);
  }

  const response = await apiClient.get<Detection[]>(`/result/${videoId}/detections`);
  return response.data;
}

export async function getDetectionSummary(): Promise<DetectionSummary> {
  if (USE_MOCK_DATA) {
    return mockGetDetectionSummary();
  }

  try {
    const historyResponse = await apiClient.get<VideoMetadata[]>('/history');
    const latestCompletedVideo = historyResponse.data.find((video) => video.status === 'completed');

    if (!latestCompletedVideo) {
      return {
        totalDetections: 0,
        fireCount: 0,
        smokeCount: 0,
        averageConfidenceFire: 0,
        averageConfidenceSmoke: 0,
      };
    }

    const resultResponse = await apiClient.get<{
      metrics?: {
        total_detections?: number;
        detection_counts_per_class?: { fire?: number; smoke?: number };
        average_confidence_per_class?: { fire?: number; smoke?: number };
      };
    }>(`/result/${latestCompletedVideo.id}`);

    const metrics = resultResponse.data.metrics;

    return {
      totalDetections: metrics?.total_detections ?? 0,
      fireCount: metrics?.detection_counts_per_class?.fire ?? 0,
      smokeCount: metrics?.detection_counts_per_class?.smoke ?? 0,
      averageConfidenceFire: metrics?.average_confidence_per_class?.fire ?? 0,
      averageConfidenceSmoke: metrics?.average_confidence_per_class?.smoke ?? 0,
    };
  } catch {
    return {
      totalDetections: 0,
      fireCount: 0,
      smokeCount: 0,
      averageConfidenceFire: 0,
      averageConfidenceSmoke: 0,
    };
  }
}