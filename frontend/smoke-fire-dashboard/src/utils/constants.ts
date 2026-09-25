export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

export const DETECTION_COLORS = {
  fire: "#DC2626",
  smoke: "#F97316",
} as const;

export const STATUS_COLORS = {
  success: "#16A34A",
  processing: "#2563EB",
  warning: "#EAB308",
} as const;