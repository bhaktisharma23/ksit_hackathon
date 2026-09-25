import Card from "../common/Card";

interface ActivityChartProps {
  data: { label: string; fire: number; smoke: number }[];
}

export default function ActivityChart({ data }: ActivityChartProps) {
  const maxValue = Math.max(...data.flatMap((d) => [d.fire, d.smoke]), 1);

  return (
    <Card>
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Detection Activity</h3>
      <div className="flex items-end gap-4 h-40">
        {data.map((point) => (
          <div key={point.label} className="flex-1 flex flex-col items-center gap-1">
            <div className="flex items-end gap-1 h-32 w-full justify-center">
              <div
                className="w-3 bg-fire rounded-t"
                style={{ height: `${(point.fire / maxValue) * 100}%` }}
              />
              <div
                className="w-3 bg-smoke rounded-t"
                style={{ height: `${(point.smoke / maxValue) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-400">{point.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}