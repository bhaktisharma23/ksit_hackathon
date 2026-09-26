import { apiClient } from "./api";
import { USE_MOCK_DATA } from "../utils/constants";
import { mockUploadVideo, mockAnalyzeVideo, mockGetVideoStatus } from "../mock/videoMock";
import type { VideoMetadata, VideoStatus } from "../types/video";
import { API_BASE_URL } from "../utils/constants";
import type { Detection } from "../types/detection";

export interface SavedAnalysis {
  video_id: string;
  status: string;
  filename?: string;
  analyzed_at?: string;
  source_metadata?: {
    duration_sec?: number;
  };
  detections: Detection[];
}

export async function getSavedAnalysis(
  videoId: string
): Promise<SavedAnalysis> {
  const response = await apiClient.get<SavedAnalysis>(`/result/${videoId}`);
  return response.data;
}

export function getProcessedVideoUrl(videoId: string): string {
  return `${API_BASE_URL}/result/${encodeURIComponent(videoId)}/video`;
}

export function getSourceVideoUrl(videoId: string): string {
  return `${API_BASE_URL}/result/${encodeURIComponent(videoId)}/source`;
}

export async function uploadVideo(
  file: File,
  onProgress?: (percentage: number) => void
): Promise<VideoMetadata> {
  if (USE_MOCK_DATA) {
    return mockUploadVideo(file, onProgress);
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event) => {
      if (onProgress && event.total) {
        onProgress(Math.round((event.loaded * 100) / event.total));
      }
    },
  });

  const data = response.data;
  return {
    id: data.video_id,
    fileName: data.filename,
    fileSize: file.size,
    format: file.name.split(".").pop() ?? "mp4",
    duration: 0,
    status: "uploaded",
    uploadedAt: new Date().toISOString(),
  };
}

export async function analyzeVideo(videoId: string): Promise<{ status: VideoStatus }> {
  if (USE_MOCK_DATA) {
    return mockAnalyzeVideo(videoId);
  }

  await apiClient.post(`/process/${videoId}`);
  return { status: "processing" };
}

export async function getVideoStatus(videoId: string): Promise<VideoStatus> {
  if (USE_MOCK_DATA) {
    return mockGetVideoStatus(videoId);
  }

  const response = await apiClient.get(`/status/${videoId}`);
  const backendStatus = response.data.status;

  if (backendStatus === "completed") return "completed";
  if (backendStatus.startsWith("failed")) return "failed";
  return "processing";
}