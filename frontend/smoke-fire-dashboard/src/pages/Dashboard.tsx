console.log("USE_MOCK_DATA:", import.meta.env.VITE_USE_MOCK_DATA);
import { useState, useEffect } from "react";
import { Video, Flame, Wind, Bell } from "lucide-react";
import PageContainer from "../components/layout/PageContainer";
import StatCard from "../components/dashboard/StatCard";
import DetectionSummary from "../components/dashboard/DetectionSummary";
import RecentAlerts from "../components/dashboard/RecentAlerts";
import ActivityChart from "../components/dashboard/ActivityChart";
import Loader from "../components/common/Loader";
import { getDetectionSummary } from "../services/detectionService";
import { getAlerts } from "../services/alertService";
import { getHistory } from "../services/historyService";
import type { DetectionSummary as DetectionSummaryType } from "../types/detection";
import type { Alert } from "../types/alert";
import type { VideoMetadata } from "../types/video";

export default function Dashboard() {
  const [summary, setSummary] = useState<DetectionSummaryType | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [videos, setVideos] = useState<VideoMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [summaryData, alertsData, historyData] = await Promise.all([
        getDetectionSummary(),
        getAlerts(),
        getHistory(),
      ]);
      setSummary(summaryData);
      setAlerts(alertsData);
      setVideos(historyData);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading || !summary) {
    return (
      <PageContainer title="AI Smoke & Fire Detection">
        <Loader label="Loading dashboard..." />
      </PageContainer>
    );
  }

  const activeAlerts = alerts.filter((a) => a.status === "active").length;

  const chartData = [
    { label: "Mon", fire: 4, smoke: 6 },
    { label: "Tue", fire: 2, smoke: 3 },
    { label: "Wed", fire: 8, smoke: 5 },
    { label: "Thu", fire: 3, smoke: 7 },
    { label: "Fri", fire: 6, smoke: 4 },
  ];

  return (
    <PageContainer title="AI Smoke & Fire Detection">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Videos Analyzed" value={videos.length} icon={Video} tone="processing" />
        <StatCard label="Smoke Detections" value={summary.smokeCount} icon={Wind} tone="smoke" />
        <StatCard label="Fire Detections" value={summary.fireCount} icon={Flame} tone="fire" />
        <StatCard label="Active Alerts" value={activeAlerts} icon={Bell} tone="fire" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <ActivityChart data={chartData} />
        </div>
        <DetectionSummary summary={summary} />
      </div>

      <div className="mt-4">
        <RecentAlerts alerts={alerts} />
      </div>
    </PageContainer>
  );
}