import { useState, useEffect, useCallback } from "react";
import { getDetections } from "../services/detectionService";
import type { Detection } from "../types/detection";
import type { RequestState } from "../types/api";

export function useDetectionResults(videoId: string | null) {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [state, setState] = useState<RequestState>("idle");
  const [error, setError] = useState<string | null>(null);

  const fetchDetections = useCallback(async () => {
    if (!videoId) return;
    setState("loading");
    setError(null);
    try {
      const result = await getDetections(videoId);
      setDetections(result);
      setState("success");
    } catch (err) {
      const message = (err as { message?: string }).message ?? "Failed to load detections";
      setError(message);
      setState("error");
    }
  }, [videoId]);

  useEffect(() => {
    fetchDetections();
  }, [fetchDetections]);

  return { detections, state, error, refetch: fetchDetections };
}