import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PlayCircle, Trash2 } from "lucide-react";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import VideoUploader from "../components/video/VideoUploader";
import VideoMetadataDisplay from "../components/video/VideoMetaData";
import UploadProgress from "../components/video/UploadProgress";
import VideoPlayer from "../components/video/VideoPlayer";
import DetectionTimeline from "../components/video/DetectionTimeline";
import Loader from "../components/common/Loader";
import { useVideoAnalysisContext } from "../context/VideoAnalysisContext";

export default function VideoAnalysis() {
  const [searchParams] = useSearchParams();
  const historyVideoId = searchParams.get("videoId");

  const {
    uploadFile,
    uploadProgress,
    uploadState,
    video,
    videoIsProcessed,
    uploadError,
    startAnalysis,
    loadSavedAnalysis,
    status,
    analysisState,
    analysisError,
    detections,
    seekTo,
    setSeekTo,
    previewUrl,
    clearAnalysis,
  } = useVideoAnalysisContext();

  useEffect(() => {
    if (historyVideoId) {
      void loadSavedAnalysis(historyVideoId);
    }
  }, [historyVideoId, loadSavedAnalysis]);

  const isUploading = uploadState === "loading";
  const isUploaded = uploadState === "success" && video;
  const isAnalyzing = analysisState === "loading";
  const isCompleted = status === "completed";

  const fireDetections = detections.filter(
    (detection) => detection.className === "fire"
  );
  const smokeDetections = detections.filter(
    (detection) => detection.className === "smoke"
  );

  const averageConfidence = (items: typeof detections) =>
    items.length
      ? items.reduce((total, detection) => total + detection.confidence, 0) /
        items.length
      : null;

  const fireAverageConfidence = averageConfidence(fireDetections);
  const smokeAverageConfidence = averageConfidence(smokeDetections);

  return (
    <PageContainer title="Video Analysis">
      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-4">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                Video Upload
              </h3>

              {video && (
                <Button
                  variant="secondary"
                  onClick={clearAnalysis}
                  className="flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Clear
                </Button>
              )}
            </div>

            {!video && (
              <VideoUploader
                onFileSelect={uploadFile}
                disabled={isUploading}
              />
            )}

            {isUploading && <UploadProgress percentage={uploadProgress} />}

            {uploadError && (
              <p role="alert" className="mt-2 text-sm text-fire">
                {uploadError}
              </p>
            )}

            {isUploaded && video && (
              <div className="mt-4 space-y-4">
                <VideoMetadataDisplay video={video} />
                <Button
                  variant="primary"
                  className="flex w-full items-center justify-center gap-2"
                  onClick={startAnalysis}
                  disabled={isAnalyzing || isCompleted}
                >
                  <PlayCircle size={18} />
                  {isCompleted
                    ? "Analysis Complete"
                    : isAnalyzing
                      ? "Analyzing..."
                      : "EXECUTE AI ANALYSIS"}
                </Button>
              </div>
            )}
          </Card>

          {isAnalyzing && <Loader label="Loading or running analysis..." />}

          {analysisError && (
            <p role="alert" className="text-sm text-fire">
              {analysisError}
            </p>
          )}

          {isCompleted && detections.length > 0 && (
            <Card>
              <DetectionTimeline
                detections={detections}
                onSeek={setSeekTo}
              />
            </Card>
          )}
        </div>

        <div className="col-span-2 space-y-4">
          <VideoPlayer
            videoUrl={previewUrl}
            detections={
              isCompleted && !videoIsProcessed ? detections : []
            }
            seekTo={seekTo}
          />

          {isCompleted && (
            <Card>
              <h3 className="mb-4 text-sm font-semibold text-gray-700">
                Analysis Summary
              </h3>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-gray-500">Total annotations</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {detections.length}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Fire annotations</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {fireDetections.length}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Average fire confidence
                  </p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {fireAverageConfidence === null
                      ? "N/A"
                      : `${(fireAverageConfidence * 100).toFixed(1)}%`}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Smoke annotations</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {smokeDetections.length}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Average smoke confidence
                  </p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {smokeAverageConfidence === null
                      ? "N/A"
                      : `${(smokeAverageConfidence * 100).toFixed(1)}%`}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
}