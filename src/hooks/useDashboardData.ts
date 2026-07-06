import { useCallback, useEffect, useState } from "react";
import { loadDashboardData } from "../services/dashboardService";
import { DashboardData } from "../types/finance";

type DashboardState = {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
};

export function useDashboardData(selectedMonth: string) {
  const [state, setState] = useState<DashboardState>({
    data: null,
    isLoading: true,
    error: null,
  });

  const reload = useCallback(async () => {
    setState((current) => ({ ...current, isLoading: true, error: null }));

    try {
      const data = await loadDashboardData(selectedMonth);
      setState({ data, isLoading: false, error: null });
    } catch (error: unknown) {
      setState({
        data: null,
        isLoading: false,
        error: error instanceof Error ? error.message : "No se pudo cargar el dashboard.",
      });
    }
  }, [selectedMonth]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { ...state, reload };
}
