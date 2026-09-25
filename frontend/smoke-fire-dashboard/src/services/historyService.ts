import { apiClient } from "./api";
import { USE_MOCK_DATA } from "../utils/constants";
import { mockGetHistory } from "../mock/videoMock";
import type { VideoMetadata } from "../types/video";

export async function getHistory(): Promise<VideoMetadata[]> {
  if (USE_MOCK_DATA) {
    return mockGetHistory();
  }

  const response = await apiClient.get<VideoMetadata[]>("/history");
  return response.data;
}

export async function getAnalysisHistory(videoId: string) {
  const response = await apiClient.get(`/history/${videoId}`);
  return response.data;
}