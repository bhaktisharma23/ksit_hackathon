export type VideoStatus = "uploaded" | "processing" | "completed" | "failed";

export interface VideoMetadata {
  id: string;
  fileName: string;
  fileSize: number;
  format: string;
  duration: number;
  status: VideoStatus;
  uploadedAt: string;
}

export interface UploadProgress {
  percentage: number;
  transferredBytes: number;
  totalBytes: number;
  speedBytesPerSec: number;
  etaSeconds: number;
}

export interface AnalysisResult {
  videoId: string;
  status: VideoStatus;
  detections: import("./detection").Detection[];
  processedVideoUrl?: string;
}