import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/common/Card";
import Loader from "../components/common/Loader";
import HistoryTable from "../components/history/HistoryTable";
import { getHistory } from "../services/historyService";
import type { VideoMetadata } from "../types/video";

export default function History() {
  const [videos, setVideos] = useState<VideoMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getHistory();
        setVideos(data);
      } catch (err) {
        setError(
          (err as { message?: string }).message ?? "Failed to load history"
        );
      } finally {
        setLoading(false);
      }
    }

    void loadHistory();
  }, []);

  function handleOpen(videoId: string) {
    navigate(`/video-analysis?videoId=${encodeURIComponent(videoId)}`);
  }

  return (
    <PageContainer title="History">
      <Card>
        {loading ? (
          <Loader label="Loading history..." />
        ) : error ? (
          <p role="alert" className="text-sm text-fire">
            {error}
          </p>
        ) : (
          <HistoryTable videos={videos} onOpen={handleOpen} />
        )}
      </Card>
    </PageContainer>
  );
}