import { useRef, useState, useEffect } from "react";
import { Play, Pause, Maximize, Volume2 } from "lucide-react";
import DetectionOverlay from "./DetectionOverlay";
import { formatDuration } from "../../utils/formatters";
import type { Detection } from "../../types/detection";

interface VideoPlayerProps {
  videoUrl?: string;
  detections: Detection[];
  seekTo?: number;
  showOverlay?: boolean;
}

export default function VideoPlayer({ videoUrl, detections, seekTo, showOverlay = true }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (seekTo !== undefined && videoRef.current) {
      videoRef.current.currentTime = seekTo;
    }
  }, [seekTo]);

  function togglePlay() {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }

  function handleTimeUpdate() {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  }

  function handleLoadedMetadata() {
    if (videoRef.current) setDuration(videoRef.current.duration);
  }

  function handleSeek(event: React.ChangeEvent<HTMLInputElement>) {
    const time = Number(event.target.value);
    if (videoRef.current) videoRef.current.currentTime = time;
    setCurrentTime(time);
  }

  function handleFullscreen() {
    containerRef.current?.requestFullscreen();
  }

  return (
    <div ref={containerRef} className="relative bg-black rounded-2xl overflow-hidden aspect-video">
      {videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
          No video loaded
        </div>
      )}

      {showOverlay && <DetectionOverlay detections={detections} currentTime={currentTime} />}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 space-y-2">
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          aria-label="Seek video"
          className="w-full accent-fire"
        />
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <Volume2 size={18} />
            <span className="text-xs">
              {formatDuration(currentTime)} / {formatDuration(duration)}
            </span>
          </div>
          <button onClick={handleFullscreen} aria-label="Fullscreen">
            <Maximize size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}