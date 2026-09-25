import { useState, useEffect } from "react";
import { connectRealtimeStream } from "../services/realtimeService";
import type { RealtimeStatus } from "../services/realtimeService";
import type { Detection } from "../types/detection";

export function useRealtimeMonitoring() {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [status, setStatus] = useState<RealtimeStatus>({
    connected: false,
    fps: 0,
    modelStatus: "inactive",
  });

  useEffect(() => {
    const disconnect = connectRealtimeStream(
      (detection) => setDetections((prev) => [detection, ...prev].slice(0, 10)),
      (newStatus) => setStatus(newStatus)
    );
    return disconnect;
  }, []);

  return { detections, status };
}