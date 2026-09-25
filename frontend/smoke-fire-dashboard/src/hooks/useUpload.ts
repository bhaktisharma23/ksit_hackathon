import { useState, useCallback } from "react";
import { uploadVideo } from "../services/videoService";
import type { VideoMetadata } from "../types/video";
import type { RequestState } from "../types/api";

export function useUpload() {
  const [progress, setProgress] = useState(0);
  const [state, setState] = useState<RequestState>("idle");
  const [video, setVideo] = useState<VideoMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (file: File) => {
    setState("loading");
    setError(null);
    setProgress(0);
    try {
      const result = await uploadVideo(file, setProgress);
      setVideo(result);
      setState("success");
    } catch (err) {
      const message = (err as { message?: string }).message ?? "Upload failed";
      setError(message);
      setState("error");
    }
  }, []);

  const reset = useCallback(() => {
    setProgress(0);
    setState("idle");
    setVideo(null);
    setError(null);
  }, []);

  return { upload, reset, progress, state, video, error };
}