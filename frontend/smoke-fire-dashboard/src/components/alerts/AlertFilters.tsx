import type { AlertFilters as AlertFiltersType, AlertStatus } from "../../types/alert";
import type { DetectionClass } from "../../types/detection";

interface AlertFiltersProps {
  filters: AlertFiltersType;
  onChange: (filters: AlertFiltersType) => void;
}

export default function AlertFilters({ filters, onChange }: AlertFiltersProps) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <input
        type="text"
        placeholder="Search source..."
        value={filters.searchQuery ?? ""}
        onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
        className="px-3 py-2 rounded-lg bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-fire/40"
      />

      <select
        value={filters.type ?? ""}
        onChange={(e) => onChange({ ...filters, type: (e.target.value || undefined) as DetectionClass | undefined })}
        className="px-3 py-2 rounded-lg bg-gray-100 text-sm"
      >
        <option value="">All Types</option>
        <option value="fire">Fire</option>
        <option value="smoke">Smoke</option>
      </select>

      <select
        value={filters.status ?? ""}
        onChange={(e) => onChange({ ...filters, status: (e.target.value || undefined) as AlertStatus | undefined })}
        className="px-3 py-2 rounded-lg bg-gray-100 text-sm"
      >
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="acknowledged">Acknowledged</option>
        <option value="resolved">Resolved</option>
      </select>
    </div>
  );
}