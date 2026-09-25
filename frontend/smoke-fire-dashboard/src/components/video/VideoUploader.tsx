import { useRef, type ChangeEvent } from "react";
import { UploadCloud } from "lucide-react";

interface VideoUploaderProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function VideoUploader({ onFileSelect, disabled }: VideoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) onFileSelect(file);
  }

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      className={`border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-fire/50 transition-colors ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <UploadCloud size={32} className="text-gray-400" />
      <p className="text-sm text-gray-600 font-medium">Click to select a video file</p>
      <p className="text-xs text-gray-400">MP4, MOV, AVI supported</p>
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
        aria-label="Upload video file"
      />
    </div>
  );
}