import { useEffect, useState } from "react";
import { Video, Flame, Wind, Bell } from "lucide-react";
import PageContainer from "../components/layout/PageContainer";
import StatCard from "../components/dashboard/StatCard";
import DetectionSummary from "../components/dashboard/DetectionSummary";
import RecentAlerts from "../components/dashboard/RecentAlerts";
import ActivityChart from "../components/dashboard/ActivityChart";
import Loader from "../components/common/Loader";
import { getDashboardData } from "../services/dashboardService";
import type { DashboardData } from "../services/dashboardService";

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardData["summary"] | null>(null);
  const [alerts, setAlerts] = useState<DashboardData["alerts"]>([]);
  const [activity, setActivity] = useState<DashboardData["activity"]>([]);
  const [videoCount, setVideoCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getDashboardData();
        setSummary(data.summary);
        setAlerts(data.alerts);
        setActivity(data.activity);
        setVideoCount(data.videosAnalyzed);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <PageContainer title="AI Smoke & Fire Detection">
        <Loader label="Loading dashboard..." />
      </PageContainer>
    );
  }

  if (error || !summary) {
    return (
      <PageContainer title="AI Smoke & Fire Detection">
        <p role="alert">{error ?? "Dashboard data is unavailable."}</p>
      </PageContainer>
    );
  }

  const activeAlerts = alerts.filter((alert) => alert.status === "active").length;

  return (
    <PageContainer title="AI Smoke & Fire Detection">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Videos Analyzed"
          value={videoCount}
          icon={Video}
          tone="processing"
        />
        <StatCard
          label="Smoke Detections"
          value={summary.smokeCount}
          icon={Wind}
          tone="smoke"
        />
        <StatCard
          label="Fire Detections"
          value={summary.fireCount}
          icon={Flame}
          tone="fire"
        />
        <StatCard
          label="Active Alerts"
          value={activeAlerts}
          icon={Bell}
          tone="fire"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <ActivityChart data={activity} />
        </div>
        <DetectionSummary summary={summary} />
      </div>

      <div className="mt-4">
        <RecentAlerts alerts={alerts} />
      </div>
    </PageContainer>
  );
}