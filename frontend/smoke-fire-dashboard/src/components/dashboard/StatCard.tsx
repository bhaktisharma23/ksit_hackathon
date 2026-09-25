import type { LucideIcon } from "lucide-react";
import Card from "../common/Card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "fire" | "smoke" | "success" | "processing";
}

const toneStyles = {
  fire: "bg-red-50 text-fire",
  smoke: "bg-orange-50 text-smoke",
  success: "bg-green-50 text-success",
  processing: "bg-blue-50 text-processing",
};

export default function StatCard({ label, value, icon: Icon, tone = "processing" }: StatCardProps) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${toneStyles[tone]}`}>
        <Icon size={20} />
      </div>
    </Card>
  );
}