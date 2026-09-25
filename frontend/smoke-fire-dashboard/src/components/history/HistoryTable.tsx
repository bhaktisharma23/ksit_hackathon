import Badge from "../common/Badge";
import EmptyState from "../common/EmptyState";
import { formatDuration, formatTimestamp } from "../../utils/formatters";
import type { VideoMetadata } from "../../types/video";

interface HistoryTableProps {
  videos: VideoMetadata[];
  onOpen: (videoId: string) => void;
}

export default function HistoryTable({ videos, onOpen }: HistoryTableProps) {
  if (videos.length === 0) {
    return <EmptyState title="No analysis history yet" />;
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-gray-500 border-b border-gray-100">
          <th className="py-2 font-medium">Video</th>
          <th className="py-2 font-medium">Date</th>
          <th className="py-2 font-medium">Duration</th>
          <th className="py-2 font-medium">Status</th>
          <th className="py-2 font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {videos.map((video) => (
          <tr key={video.id} className="border-b border-gray-50">
            <td className="py-3 text-gray-900 font-medium">{video.fileName}</td>
            <td className="py-3 text-gray-500">{formatTimestamp(video.uploadedAt)}</td>
            <td className="py-3 text-gray-500">{formatDuration(video.duration)}</td>
            <td className="py-3">
              <Badge tone={video.status === "completed" ? "success" : "processing"}>
                {video.status.toUpperCase()}
              </Badge>
            </td>
            <td className="py-3">
              <button onClick={() => onOpen(video.id)} className="text-fire text-xs font-semibold hover:underline">
                View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}