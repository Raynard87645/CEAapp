import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { useAuth } from '@/context/auth-context';
import { driverApi, type DriverDashboard } from '@/services/api/driver';

type DriverContextValue = {
  dashboard: DriverDashboard | null;
  loading: boolean;
  refreshDashboard: () => Promise<void>;
};

const DriverContext = createContext<DriverContextValue | null>(null);

export function DriverProvider({ children }: { children: ReactNode }) {
  const { role, isAuthenticated } = useAuth();
  const [dashboard, setDashboard] = useState<DriverDashboard | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshDashboard = useCallback(async () => {
    if (role !== 'driver' || !isAuthenticated) {
      setDashboard(null);
      return;
    }

    setLoading(true);

    try {
    const data = await driverApi.dashboard();

    console.log(
      'DRIVER DASHBOARD RESPONSE',
      JSON.stringify(data, null, 2),
    );

    setDashboard(data);
  } catch (error) {
    console.error(
      'DRIVER DASHBOARD ERROR',
      error,
    );

    setDashboard(null);
} finally {
      setLoading(false);
    }
  }, [isAuthenticated, role]);

  useEffect(() => {
    void refreshDashboard();
  }, [refreshDashboard]);

  const value = useMemo(
    () => ({
      dashboard,
      loading,
      refreshDashboard,
    }),
    [dashboard, loading, refreshDashboard],
  );

  return <DriverContext.Provider value={value}>{children}</DriverContext.Provider>;
}

export function useDriver() {
  const context = useContext(DriverContext);

  if (!context) {
    throw new Error('useDriver must be used within DriverProvider');
  }

  return context;
}
