import Card from "../common/Card";
import Badge from "../common/Badge";
import EmptyState from "../common/EmptyState";
import { formatTimestamp, formatConfidence } from "../../utils/formatters";
import type { Alert } from "../../types/alert";

interface RecentAlertsProps {
  alerts: Alert[];
}

export default function RecentAlerts({ alerts }: RecentAlertsProps) {
  return (
    <Card>
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Alerts</h3>
      {alerts.length === 0 ? (
        <EmptyState title="No recent alerts" />
      ) : (
        <div className="space-y-3">
          {alerts.slice(0, 5).map((alert) => (
            <div key={alert.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Badge tone={alert.type}>{alert.type.toUpperCase()}</Badge>
                <span className="text-gray-500">{alert.source}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-xs">{formatConfidence(alert.confidence)}</span>
                <span className="text-gray-400 text-xs">{formatTimestamp(alert.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}