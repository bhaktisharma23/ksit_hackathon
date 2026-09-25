import { formatFileSize } from "../../utils/formatters";
import type { VideoMetadata as VideoMetadataType } from "../../types/video";

interface VideoMetadataProps {
  video: VideoMetadataType;
}

export default function VideoMetadata({ video }: VideoMetadataProps) {
  const rows = [
    { label: "File name", value: video.fileName },
    { label: "File size", value: formatFileSize(video.fileSize) },
    { label: "Format", value: video.format },
    { label: "Status", value: video.status },
  ];

  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div key={row.label} className="flex justify-between text-sm">
          <span className="text-gray-500">{row.label}</span>
          <span className="text-gray-900 font-medium">{row.value}</span>
        </div>
      ))}
    </div>
  );
}