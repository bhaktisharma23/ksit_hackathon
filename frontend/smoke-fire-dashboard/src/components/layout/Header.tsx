import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronDown, X } from "lucide-react";
import { getAlerts } from "../../services/alertService";
import type { Alert } from "../../types/alert";

const KNOWN_ALERTS_KEY = "ignis-known-alert-ids";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [notification, setNotification] = useState<Alert | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let firstPoll = true;
    let knownIds = new Set<string>();

    try {
      const savedIds = sessionStorage.getItem(KNOWN_ALERTS_KEY);
      if (savedIds !== null) {
        knownIds = new Set<string>(JSON.parse(savedIds));
        firstPoll = false;
      }
    } catch {
      sessionStorage.removeItem(KNOWN_ALERTS_KEY);
    }

    async function pollAlerts() {
      try {
        const currentAlerts = await getAlerts({ status: "active" });
        if (cancelled) return;

        setAlerts(currentAlerts.slice(0, 5));

        const newAlerts = currentAlerts.filter(
          (alert) => !knownIds.has(alert.id)
        );

        if (!firstPoll && newAlerts.length > 0) {
          setNotification(newAlerts[0]);
          setUnreadCount((count) => count + newAlerts.length);
        }

        firstPoll = false;
        currentAlerts.forEach((alert) => knownIds.add(alert.id));
        sessionStorage.setItem(
          KNOWN_ALERTS_KEY,
          JSON.stringify([...knownIds])
        );
      } catch (error) {
        console.error("Failed to fetch alerts", error);
      }
    }

    void pollAlerts();
    const intervalId = window.setInterval(() => void pollAlerts(), 5000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  function openAlerts() {
    setIsOpen((open) => !open);
    setUnreadCount(0);
    setNotification(null);
  }

  function goToAlertLogs() {
    setIsOpen(false);
    setNotification(null);
    navigate("/alerts");
  }

  return (
    <header className="relative z-20 flex items-center justify-between border-b border-gray-100 bg-white px-8 py-4">
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>

      <div className="flex items-center gap-5">
        <div className="relative">
          <button
            type="button"
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
            aria-expanded={isOpen}
            onClick={openAlerts}
            className="relative text-gray-500 hover:text-gray-800"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-fire px-1 text-[10px] text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-3 w-80 rounded-lg border border-gray-200 bg-white shadow-lg">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <h2 className="text-sm font-semibold text-gray-800">
                  Recent alerts
                </h2>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close notifications"
                  className="text-gray-400 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              </div>

              {alerts.length === 0 ? (
                <p className="px-4 py-5 text-sm text-gray-500">
                  No active alerts
                </p>
              ) : (
                <ul>
                  {alerts.map((alert) => (
                    <li key={alert.id}>
                      <button
                        type="button"
                        onClick={goToAlertLogs}
                        className="w-full border-b border-gray-50 px-4 py-3 text-left hover:bg-gray-50"
                      >
                        <span className="font-semibold text-fire">
                          {alert.type.toUpperCase()}
                        </span>
                        <span className="ml-2 text-sm text-gray-700">
                          {alert.source}
                        </span>
                        <span className="mt-1 block text-xs text-gray-400">
                          {new Date(alert.timestamp).toLocaleString()} ·{" "}
                          {(alert.confidence * 100).toFixed(1)}% confidence
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <button
                type="button"
                onClick={goToAlertLogs}
                className="w-full px-4 py-3 text-left text-sm font-medium text-fire hover:bg-gray-50"
              >
                View all alerts
              </button>
            </div>
          )}
        </div>

        <div className="flex cursor-pointer items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-sm font-semibold text-gray-700">
            A
          </div>
          <span className="text-sm font-medium text-gray-700">Admin</span>
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>

      {notification && (
        <button
          type="button"
          onClick={goToAlertLogs}
          className="fixed right-6 top-20 z-50 w-80 rounded-lg border border-red-200 bg-white p-4 text-left shadow-lg"
        >
          <span className="block text-sm font-semibold text-fire">
            {notification.type.toUpperCase()} detected
          </span>
          <span className="mt-1 block text-sm text-gray-700">
            {notification.source} ·{" "}
            {(notification.confidence * 100).toFixed(1)}% confidence
          </span>
        </button>
      )}
    </header>
  );
}