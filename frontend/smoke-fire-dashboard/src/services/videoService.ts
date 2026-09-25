import { apiClient } from "./api";
import { USE_MOCK_DATA } from "../utils/constants";
import { mockUploadVideo, mockAnalyzeVideo, mockGetVideoStatus } from "../mock/videoMock";
import type { VideoMetadata, VideoStatus } from "../types/video";

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