interface UploadProgressProps {
  percentage: number;
}

export default function UploadProgress({ percentage }: UploadProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Uploading...</span>
        <span className="font-semibold text-gray-900">{percentage}%</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-fire transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}