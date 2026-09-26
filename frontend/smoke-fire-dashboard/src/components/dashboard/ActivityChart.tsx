import Card from "../common/Card";

interface ActivityChartProps {
  data: { label: string; fire: number; smoke: number }[];
}

export default function ActivityChart({ data }: ActivityChartProps) {
  const maxValue = Math.max(...data.flatMap((d) => [d.fire, d.smoke]), 1);

  return (
    <div className="h-40 overflow-x-auto">
  <div className="flex h-full min-w-[900px] items-end gap-2">
    {data.map((point) => (
      <div
        key={point.label}
        className="flex h-full min-w-7 flex-1 flex-col items-center justify-end gap-1"
      >
        <div className="flex h-32 w-full items-end justify-center gap-1">
          <div
            className="w-3 rounded-t bg-fire"
            style={{ height: `${(point.fire / maxValue) * 100}%` }}
            title={`Fire: ${point.fire}`}
          />
          <div
            className="w-3 rounded-t bg-smoke"
            style={{ height: `${(point.smoke / maxValue) * 100}%` }}
            title={`Smoke: ${point.smoke}`}
          />
        </div>
        <span className="text-xs text-gray-400">{point.label}</span>
      </div>
    ))}
  </div>
</div>
  );
}