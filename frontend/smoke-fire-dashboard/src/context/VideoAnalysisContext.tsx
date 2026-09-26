import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  uploadVideo,
  analyzeVideo,
  getVideoStatus,
  getSavedAnalysis,
  getSourceVideoUrl,
} from "../services/videoService";
import { getDetections } from "../services/detectionService";
import type { Detection } from "../types/detection";
import type { RequestState } from "../types/api";
import type { VideoMetadata, VideoStatus } from "../types/video";

interface VideoAnalysisContextValue {
  video: VideoMetadata | null;
  previewUrl: string | undefined;
  videoIsProcessed: boolean;
  detections: Detection[];
  status: VideoStatus | null;
  uploadProgress: number;
  uploadState: RequestState;
  uploadError: string | null;
  analysisState: RequestState;
  analysisError: string | null;
  seekTo: number | undefined;
  uploadFile: (file: File) => Promise<void>;
  startAnalysis: () => Promise<void>;
  loadSavedAnalysis: (videoId: string) => Promise<void>;
  clearAnalysis: () => void;
  setSeekTo: (timestamp: number) => void;
}

const VideoAnalysisContext =
  createContext<VideoAnalysisContextValue | null>(null);

export function VideoAnalysisProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [video, setVideo] = useState<VideoMetadata | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const previewUrlRef = useRef<string>();
  const [videoIsProcessed, setVideoIsProcessed] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [status, setStatus] = useState<VideoStatus | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadState, setUploadState] = useState<RequestState>("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [analysisState, setAnalysisState] = useState<RequestState>("idle");
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [seekTo, setSeekTo] = useState<number>();

  useEffect(() => {
    previewUrlRef.current = previewUrl;
  }, [previewUrl]);

  const uploadFile = useCallback(async (file: File) => {
    if (previewUrlRef.current?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const localPreviewUrl = URL.createObjectURL(file);
    previewUrlRef.current = localPreviewUrl;
    setPreviewUrl(localPreviewUrl);
    setVideoIsProcessed(false);
    setVideo(null);
    setDetections([]);
    setStatus(null);
    setSeekTo(undefined);
    setUploadProgress(0);
    setUploadError(null);
    setAnalysisError(null);
    setUploadState("loading");
    setAnalysisState("idle");

    try {
      const uploadedVideo = await uploadVideo(file, setUploadProgress);
      setVideo(uploadedVideo);
      setStatus("uploaded");
      setUploadState("success");
    } catch (error) {
      const message =
        (error as { message?: string }).message ?? "Upload failed";
      setUploadError(message);
      setUploadState("error");
    }
  }, []);

  const startAnalysis = useCallback(async () => {
    if (!video) return;

    setAnalysisState("loading");
    setAnalysisError(null);

    try {
      await analyzeVideo(video.id);
      setStatus("processing");
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Analysis failed to start";
      setAnalysisError(message);
      setAnalysisState("error");
    }
  }, [video]);

  const loadSavedAnalysis = useCallback(async (videoId: string) => {
    if (previewUrlRef.current?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    setVideo(null);
    setPreviewUrl(undefined);
    setVideoIsProcessed(false);
    setDetections([]);
    setStatus(null);
    setUploadError(null);
    setAnalysisError(null);
    setUploadState("loading");
    setAnalysisState("loading");

    try {
      const result = await getSavedAnalysis(videoId);
      const fileName = result.filename ?? `${videoId}.mp4`;

      setVideo({
        id: videoId,
        fileName,
        fileSize: 0,
        format: fileName.split(".").pop() ?? "",
        duration: result.source_metadata?.duration_sec ?? 0,
        status: "completed",
        uploadedAt: result.analyzed_at ?? new Date().toISOString(),
      });
      setPreviewUrl(getSourceVideoUrl(videoId));
      setVideoIsProcessed(false);
      setDetections(result.detections ?? []);
      setStatus("completed");
      setUploadState("success");
      setAnalysisState("success");
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Could not load the saved analysis";
      setUploadState("error");
      setAnalysisState("error");
      setAnalysisError(message);
    }
  }, []);

  useEffect(() => {
    if (!video || status !== "processing") return;

    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout>;

    async function pollStatus() {
      try {
        const currentStatus = await getVideoStatus(video!.id);
        if (cancelled) return;

        if (currentStatus === "completed") {
          const results = await getDetections(video!.id);
          if (cancelled) return;

          setDetections(results);
          setVideoIsProcessed(false);
          setStatus("completed");
          setAnalysisState("success");
          return;
        }

        if (currentStatus === "failed") {
          setStatus("failed");
          setAnalysisError("Video analysis failed");
          setAnalysisState("error");
          return;
        }

        setStatus(currentStatus);
      } catch (error) {
        if (!cancelled) {
          console.warn("Status poll failed; retrying...", error);
        }
      }

      if (!cancelled) {
        timeout = setTimeout(pollStatus, 2000);
      }
    }

    timeout = setTimeout(pollStatus, 2000);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [video, status]);

  const clearAnalysis = useCallback(() => {
    if (previewUrlRef.current?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    previewUrlRef.current = undefined;
    setVideo(null);
    setPreviewUrl(undefined);
    setVideoIsProcessed(false);
    setDetections([]);
    setStatus(null);
    setUploadProgress(0);
    setUploadState("idle");
    setUploadError(null);
    setAnalysisState("idle");
    setAnalysisError(null);
    setSeekTo(undefined);
  }, []);

  return (
    <VideoAnalysisContext.Provider
      value={{
        video,
        previewUrl,
        videoIsProcessed,
        detections,
        status,
        uploadProgress,
        uploadState,
        uploadError,
        analysisState,
        analysisError,
        seekTo,
        uploadFile,
        startAnalysis,
        loadSavedAnalysis,
        clearAnalysis,
        setSeekTo,
      }}
    >
      {children}
    </VideoAnalysisContext.Provider>
  );
}

export function useVideoAnalysisContext() {
  const context = useContext(VideoAnalysisContext);

  if (!context) {
    throw new Error(
      "useVideoAnalysisContext must be used inside VideoAnalysisProvider"
    );
  }

  return context;
}