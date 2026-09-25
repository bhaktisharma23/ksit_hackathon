import { apiClient } from "./api";
import { USE_MOCK_DATA } from "../utils/constants";
import { mockUploadVideo, mockAnalyzeVideo, mockGetVideoStatus } from "../mock/videoMock";
import type { VideoMetadata, AnalysisResult, VideoStatus } from "../types/video";

export async function uploadVideo(
  file: File,
  onProgress?: (percentage: number) => void
): Promise<VideoMetadata> {
  if (USE_MOCK_DATA) {
    return mockUploadVideo(file, onProgress);
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<VideoMetadata>("/videos/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event) => {
      if (onProgress && event.total) {
        onProgress(Math.round((event.loaded * 100) / event.total));
      }
    },
  });

  return response.data;
}

export async function analyzeVideo(videoId: string): Promise<{ status: VideoStatus }> {
  if (USE_MOCK_DATA) {
    return mockAnalyzeVideo(videoId);
  }

  const response = await apiClient.post<{ status: VideoStatus }>(`/videos/${videoId}/analyze`);
  return response.data;
}

export async function getVideoStatus(videoId: string): Promise<VideoStatus> {
  if (USE_MOCK_DATA) {
    return mockGetVideoStatus(videoId);
  }

  const response = await apiClient.get<{ status: VideoStatus }>(`/videos/${videoId}/analysis`);
  return response.data.status;
}

export async function getAnalysisResult(videoId: string): Promise<AnalysisResult> {
  const response = await apiClient.get<AnalysisResult>(`/videos/${videoId}/analysis`);
  return response.data;
}