import Card from "../common/Card";
import { formatConfidence } from "../../utils/formatters";
import type { DetectionSummary as DetectionSummaryType } from "../../types/detection";

interface DetectionSummaryProps {
  summary: DetectionSummaryType;
}

export default function DetectionSummary({ summary }: DetectionSummaryProps) {
  return (
    <Card>
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Detection Statistics</h3>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Total detections</span>
          <span className="font-semibold text-gray-900">{summary.totalDetections}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-fire">Fire events</span>
          <span className="font-semibold text-gray-900">{summary.fireCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-smoke">Smoke events</span>
          <span className="font-semibold text-gray-900">{summary.smokeCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Avg. fire confidence</span>
          <span className="font-semibold text-gray-900">{formatConfidence(summary.averageConfidenceFire)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Avg. smoke confidence</span>
          <span className="font-semibold text-gray-900">{formatConfidence(summary.averageConfidenceSmoke)}</span>
        </div>
      </div>
    </Card>
  );
}