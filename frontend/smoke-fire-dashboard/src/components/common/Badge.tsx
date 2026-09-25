import type { ReactNode } from "react";

type BadgeTone = "fire" | "smoke" | "success" | "processing" | "warning" | "neutral";

interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
}

const toneStyles: Record<BadgeTone, string> = {
  fire: "bg-red-100 text-fire",
  smoke: "bg-orange-100 text-smoke",
  success: "bg-green-100 text-success",
  processing: "bg-blue-100 text-processing",
  warning: "bg-yellow-100 text-warning",
  neutral: "bg-gray-100 text-gray-700",
};

export default function Badge({ tone = "neutral", children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${toneStyles[tone]}`}>
      {children}
    </span>
  );
}