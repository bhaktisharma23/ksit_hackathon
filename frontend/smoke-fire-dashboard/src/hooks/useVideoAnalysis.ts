import { useState, useCallback, useRef, useEffect } from "react";
import { analyzeVideo, getVideoStatus } from "../services/videoService";
import type { VideoStatus } from "../types/video";
import type { RequestState } from "../types/api";

export function useVideoAnalysis(videoId: string | null) {
  const [status, setStatus] = useState<VideoStatus | null>(null);
  const [state, setState] = useState<RequestState>("idle");
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAnalysis = useCallback(async () => {
    if (!videoId) return;
    setState("loading");
    setError(null);

    try {
      await analyzeVideo(videoId);
      setStatus("processing");

      pollRef.current = setInterval(async () => {
        try {
          const currentStatus = await getVideoStatus(videoId);
          setStatus(currentStatus);

          if (currentStatus === "completed" || currentStatus === "failed") {
            if (pollRef.current) clearInterval(pollRef.current);
            setState(currentStatus === "completed" ? "success" : "error");
          }
        } catch (pollErr) {
    
          console.warn("Status poll failed, retrying...", pollErr);
        }
      }, 2000);

    } catch (err) {
      const message = (err as { message?: string }).message ?? "Analysis failed to start";
      setError(message);
      setState("error");
    }
  }, [videoId]);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  return { startAnalysis, status, state, error };
}