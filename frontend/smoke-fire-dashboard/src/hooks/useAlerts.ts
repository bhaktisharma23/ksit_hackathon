import { useState, useEffect, useCallback } from "react";
import { getAlerts, updateAlertStatus } from "../services/alertService";
import type { Alert, AlertFilters, AlertStatus } from "../types/alert";
import type { RequestState } from "../types/api";

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filters, setFilters] = useState<AlertFilters>({});
  const [state, setState] = useState<RequestState>("idle");

  const fetchAlerts = useCallback(async () => {
    setState("loading");
    try {
      const result = await getAlerts(filters);
      setAlerts(result);
      setState("success");
    } catch {
      setState("error");
    }
  }, [filters]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  async function changeStatus(id: string, status: AlertStatus) {
    await updateAlertStatus(id, status);
    fetchAlerts();
  }

  return { alerts, filters, setFilters, state, changeStatus };
}