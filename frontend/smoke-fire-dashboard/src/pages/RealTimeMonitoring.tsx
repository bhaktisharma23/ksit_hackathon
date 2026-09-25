import { Radio, Activity } from "lucide-react";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import EmptyState from "../components/common/EmptyState";
import { useRealtimeMonitoring } from "../hooks/useRealtimeMonitoring";
import { formatConfidence } from "../utils/formatters";

export default function RealTimeMonitoring() {
  const { detections, status } = useRealtimeMonitoring();

  return (
    <PageContainer title="Real-time Monitoring">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card className="aspect-video bg-black flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Radio size={32} className="mx-auto mb-2" />
              <p className="text-sm">Live camera feed placeholder</p>
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <Card>
              <p className="text-xs text-gray-500">Connection</p>
              <Badge tone={status.connected ? "success" : "fire"}>
                {status.connected ? "CONNECTED" : "DISCONNECTED"}
              </Badge>
            </Card>
            <Card>
              <p className="text-xs text-gray-500">FPS</p>
              <p className="text-lg font-bold text-gray-900">{status.fps}</p>
            </Card>
            <Card>
              <p className="text-xs text-gray-500">Model Status</p>
              <Badge tone={status.modelStatus === "active" ? "success" : "neutral"}>
                {status.modelStatus.toUpperCase()}
              </Badge>
            </Card>
          </div>
        </div>

        <Card>
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Activity size={16} /> Live Detections
          </h3>
          {detections.length === 0 ? (
            <EmptyState title="No detections yet" description="Waiting for live stream data" />
          ) : (
            <div className="space-y-3">
              {detections.map((d) => (
                <div key={d.id} className="flex items-center justify-between text-sm">
                  <Badge tone={d.className}>{d.className.toUpperCase()}</Badge>
                  <span className="text-gray-500">{formatConfidence(d.confidence)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </PageContainer>
  );
}