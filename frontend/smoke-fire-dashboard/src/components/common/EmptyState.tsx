import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
}

export default function EmptyState({ icon: Icon = Inbox, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <Icon size={36} className="text-gray-300" />
      <p className="text-gray-700 font-medium">{title}</p>
      {description && <p className="text-gray-400 text-sm">{description}</p>}
    </div>
  );
}