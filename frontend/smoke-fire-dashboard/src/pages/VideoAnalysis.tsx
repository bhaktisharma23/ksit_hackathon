import { useState } from "react";
import { PlayCircle } from "lucide-react";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import VideoUploader from "../components/video/VideoUploader";
import VideoMetadataDisplay from "../components/video/VideoMetaData";
import UploadProgress from "../components/video/UploadProgress";
import VideoPlayer from "../components/video/VideoPlayer";
import DetectionTimeline from "../components/video/DetectionTimeline";
import Loader from "../components/common/Loader";
import { useUpload } from "../hooks/useUpload";
import { useVideoAnalysis } from "../hooks/useVideoAnalysis";
import { useDetectionResults } from "../hooks/useDetectionResults";

export default function VideoAnalysis() {
  const { upload, progress, state: uploadState, video, error: uploadError } = useUpload();
  const { startAnalysis, status, state: analysisState } = useVideoAnalysis(video?.id ?? null);
  const { detections } = useDetectionResults(status === "completed" ? video?.id ?? null : null);
  const [seekTo, setSeekTo] = useState<number | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  function handleFileSelect(file: File) {
    setPreviewUrl(URL.createObjectURL(file));
    upload(file);
  }

  function handleSeek(timestamp: number) {
    setSeekTo(timestamp);
  }

  const isUploading = uploadState === "loading";
  const isUploaded = uploadState === "success" && video;
  const isAnalyzing = analysisState === "loading";
  const isCompleted = status === "completed";

  return (
    <PageContainer title="Video Analysis">
      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-4">
          <Card>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Video Upload</h3>

            {!video && <VideoUploader onFileSelect={handleFileSelect} disabled={isUploading} />}

            {isUploading && <UploadProgress percentage={progress} />}

            {uploadError && <p className="text-sm text-fire mt-2">{uploadError}</p>}

            {isUploaded && video && (
              <div className="mt-4 space-y-4">
                <VideoMetadataDisplay video={video} />
                <Button
                  variant="primary"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={startAnalysis}
                  disabled={isAnalyzing || isCompleted}
                >
                  <PlayCircle size={18} />
                  {isCompleted ? "Analysis Complete" : isAnalyzing ? "Analyzing..." : "EXECUTE AI ANALYSIS"}
                </Button>
              </div>
            )}
          </Card>

          {isAnalyzing && <Loader label="Running AI detection..." />}

          {isCompleted && detections.length > 0 && (
            <Card>
              <DetectionTimeline detections={detections} onSeek={handleSeek} />
            </Card>
          )}
        </div>

        <div className="col-span-2">
          <VideoPlayer videoUrl={previewUrl} detections={isCompleted ? detections : []} seekTo={seekTo} />
        </div>
      </div>
    </PageContainer>
  );
}