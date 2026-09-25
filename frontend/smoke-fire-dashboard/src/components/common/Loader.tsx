import { Loader2 } from "lucide-react";

interface LoaderProps {
  label?: string;
}

export default function Loader({ label = "Loading..." }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8 text-gray-500">
      <Loader2 className="animate-spin" size={28} />
      <span className="text-sm">{label}</span>
    </div>
  );
}