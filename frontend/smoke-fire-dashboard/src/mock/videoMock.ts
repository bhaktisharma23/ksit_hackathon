import type { VideoMetadata, VideoStatus } from "../types/video";

const jobStatusMap = new Map<string, VideoStatus>();

export async function mockUploadVideo(
  file: File,
  onProgress?: (percentage: number) => void
): Promise<VideoMetadata> {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      onProgress?.(Math.min(progress, 100));
      if (progress >= 100) {
        clearInterval(interval);
        const videoId = `video-${Date.now()}`;
        jobStatusMap.set(videoId, "uploaded");
        resolve({
          id: videoId,
          fileName: file.name,
          fileSize: file.size,
          format: file.type || "video/mp4",
          duration: 0,
          status: "uploaded",
          uploadedAt: new Date().toISOString(),
        });
      }
    }, 200);
  });
}

export async function mockAnalyzeVideo(videoId: string): Promise<{ status: VideoStatus }> {
  jobStatusMap.set(videoId, "processing");
  setTimeout(() => jobStatusMap.set(videoId, "completed"), 3000);
  return { status: "processing" };
}

export async function mockGetVideoStatus(videoId: string): Promise<VideoStatus> {
  return jobStatusMap.get(videoId) ?? "uploaded";
}

export async function mockGetHistory(): Promise<VideoMetadata[]> {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve([
          {
            id: "video-1",
            fileName: "warehouse_fire_01.mp4",
            fileSize: 45_200_000,
            format: "video/mp4",
            duration: 136,
            status: "completed",
            uploadedAt: "2026-09-20T10:32:14Z",
          },
          {
            id: "video-2",
            fileName: "loading_dock_smoke.mp4",
            fileSize: 61_800_000,
            format: "video/mp4",
            duration: 191,
            status: "completed",
            uploadedAt: "2026-09-22T14:11:02Z",
          },
        ]),
      300
    );
  });
}