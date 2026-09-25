import { USE_MOCK_DATA } from "../utils/constants";
import type { Detection } from "../types/detection";

export interface RealtimeStatus {
  connected: boolean;
  fps: number;
  modelStatus: "active" | "inactive";
}

type DetectionCallback = (detection: Detection) => void;
type StatusCallback = (status: RealtimeStatus) => void;

export function connectRealtimeStream(
  onDetection: DetectionCallback,
  onStatus: StatusCallback
): () => void {
  if (USE_MOCK_DATA) {
    onStatus({ connected: true, fps: 24, modelStatus: "active" });

    const interval = setInterval(() => {
      const classes: Array<"fire" | "smoke"> = ["fire", "smoke"];
      const className = classes[Math.floor(Math.random() * classes.length)];
      onDetection({
        id: `rt-${Date.now()}`,
        className,
        confidence: 0.7 + Math.random() * 0.29,
        timestamp: Date.now() / 1000,
        boundingBox: { x: Math.random() * 0.6, y: Math.random() * 0.6, width: 0.2, height: 0.2 },
      });
    }, 4000);

    return () => clearInterval(interval);
  }

  const wsUrl = (import.meta.env.VITE_API_BASE_URL as string).replace(/^http/, "ws") + "/stream";
  const socket = new WebSocket(wsUrl);

  socket.onopen = () => onStatus({ connected: true, fps: 0, modelStatus: "active" });
  socket.onclose = () => onStatus({ connected: false, fps: 0, modelStatus: "inactive" });
  socket.onmessage = (event) => {
    const detection: Detection = JSON.parse(event.data);
    onDetection(detection);
  };

  return () => socket.close();
}