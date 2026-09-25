import { useState, useEffect } from "react";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/common/Card";
import Loader from "../components/common/Loader";
import HistoryTable from "../components/history/HistoryTable";
import { getHistory } from "../services/historyService";
import type { VideoMetadata } from "../types/video";

export default function History() {
  const [videos, setVideos] = useState<VideoMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory().then((data) => {
      setVideos(data);
      setLoading(false);
    });
  }, []);

  function handleOpen(videoId: string) {
    window.location.href = `/video-analysis?videoId=${videoId}`;
  }

  return (
    <PageContainer title="History">
      <Card>{loading ? <Loader label="Loading history..." /> : <HistoryTable videos={videos} onOpen={handleOpen} />}</Card>
    </PageContainer>
  );
}