import { DETECTION_COLORS } from "../../utils/constants";
import { formatConfidence } from "../../utils/formatters";
import type { Detection } from "../../types/detection";

interface DetectionOverlayProps {
  detections: Detection[];
  currentTime: number;
}

const VISIBILITY_WINDOW_SEC = 1.5;

export default function DetectionOverlay({ detections, currentTime }: DetectionOverlayProps) {
  const visibleDetections = detections.filter(
    (d) => Math.abs(d.timestamp - currentTime) <= VISIBILITY_WINDOW_SEC
  );

  return (
    <div className="absolute inset-0 pointer-events-none">
      {visibleDetections.map((detection) => (
        <div
          key={detection.id}
          className="absolute border-2 rounded"
          style={{
            left: `${detection.boundingBox.x * 100}%`,
            top: `${detection.boundingBox.y * 100}%`,
            width: `${detection.boundingBox.width * 100}%`,
            height: `${detection.boundingBox.height * 100}%`,
            borderColor: DETECTION_COLORS[detection.className],
          }}
        >
          <span
            className="absolute -top-6 left-0 text-xs font-semibold text-white px-2 py-0.5 rounded whitespace-nowrap"
            style={{ backgroundColor: DETECTION_COLORS[detection.className] }}
          >
            {detection.className.toUpperCase()} {formatConfidence(detection.confidence)}
          </span>
        </div>
      ))}
    </div>
  );
}