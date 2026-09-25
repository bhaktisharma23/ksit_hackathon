import Badge from "../common/Badge";
import EmptyState from "../common/EmptyState";
import { formatConfidence, formatTimestamp } from "../../utils/formatters";
import type { Alert, AlertStatus } from "../../types/alert";

interface AlertTableProps {
  alerts: Alert[];
  onStatusChange: (id: string, status: AlertStatus) => void;
}

const statusTone: Record<AlertStatus, "fire" | "warning" | "success"> = {
  active: "fire",
  acknowledged: "warning",
  resolved: "success",
};

export default function AlertTable({ alerts, onStatusChange }: AlertTableProps) {
  if (alerts.length === 0) {
    return <EmptyState title="No alerts found" description="Try adjusting your filters" />;
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-gray-500 border-b border-gray-100">
          <th className="py-2 font-medium">Timestamp</th>
          <th className="py-2 font-medium">Type</th>
          <th className="py-2 font-medium">Confidence</th>
          <th className="py-2 font-medium">Source</th>
          <th className="py-2 font-medium">Status</th>
        </tr>
      </thead>
      <tbody>
        {alerts.map((alert) => (
          <tr key={alert.id} className="border-b border-gray-50">
            <td className="py-3 text-gray-700">{formatTimestamp(alert.timestamp)}</td>
            <td className="py-3">
              <Badge tone={alert.type}>{alert.type.toUpperCase()}</Badge>
            </td>
            <td className="py-3 text-gray-700">{formatConfidence(alert.confidence)}</td>
            <td className="py-3 text-gray-700">{alert.source}</td>
            <td className="py-3">
              <select
                value={alert.status}
                onChange={(e) => onStatusChange(alert.id, e.target.value as AlertStatus)}
                className="text-xs"
              >
                <option value="active">Active</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="resolved">Resolved</option>
              </select>
              <Badge tone={statusTone[alert.status]}> {alert.status.toUpperCase()}</Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}