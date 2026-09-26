import { DETECTION_COLORS } from "../../utils/constants";
import { formatDuration } from "../../utils/formatters";
import type { Detection } from "../../types/detection";

interface DetectionTimelineProps {
  detections: Detection[];
  onSeek: (timestamp: number) => void;
}

export default function DetectionTimeline({
  detections,
  onSeek,
}: DetectionTimelineProps) {
  const sorted = [...detections].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-700">
        Detection Timeline
      </h3>

      <div
        className="max-h-64 space-y-1 overflow-y-auto overscroll-contain pr-2"
        aria-label="Detection events"
      >
        {sorted.map((detection) => (
          <button
            key={detection.id}
            onClick={() => onSeek(detection.timestamp)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-gray-50"
          >
            <span
              className="h-2 w-2 flex-shrink-0 rounded-full"
              style={{ backgroundColor: DETECTION_COLORS[detection.className] }}
            />
            <span className="font-mono text-xs text-gray-500">
              {formatDuration(detection.timestamp)}
            </span>
            <span className="text-xs font-semibold uppercase text-gray-800">
              {detection.className}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}