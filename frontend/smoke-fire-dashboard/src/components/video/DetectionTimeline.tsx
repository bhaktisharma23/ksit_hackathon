import { DETECTION_COLORS } from "../../utils/constants";
import { formatDuration } from "../../utils/formatters";
import type { Detection } from "../../types/detection";

interface DetectionTimelineProps {
  detections: Detection[];
  onSeek: (timestamp: number) => void;
}

export default function DetectionTimeline({ detections, onSeek }: DetectionTimelineProps) {
  const sorted = [...detections].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-700">Detection Timeline</h3>
      <div className="space-y-1">
        {sorted.map((detection) => (
          <button
            key={detection.id}
            onClick={() => onSeek(detection.timestamp)}
            className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: DETECTION_COLORS[detection.className] }}
            />
            <span className="text-xs text-gray-500 font-mono">{formatDuration(detection.timestamp)}</span>
            <span className="text-xs font-semibold text-gray-800 uppercase">{detection.className}</span>
          </button>
        ))}
      </div>
    </div>
  );
}