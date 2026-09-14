import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Alert } from 'react-native';

import { AppDrawer } from '@/components/app-drawer';
import { useAuth } from '@/context/auth-context';
import { resetToLanding } from '@/lib/navigation';

type DrawerContextValue = {
  openDrawer: () => void;
  closeDrawer: () => void;
};

const DrawerContext = createContext<DrawerContextValue | null>(null);

export function DrawerProvider({ children }: { children: ReactNode }) {
  const { logout, isAuthenticated } = useAuth();
  const [visible, setVisible] = useState(false);

  const openDrawer = useCallback(() => {
    setVisible(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setVisible(false);
  }, []);

  const handleLogout = useCallback(() => {
    Alert.alert('Log out', 'Sign out of Tour Jamaica?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => {
          void (async () => {
            closeDrawer();
            await logout();
            resetToLanding();
          })();
        },
      },
    ]);
  }, [closeDrawer, logout]);

  const value = useMemo(
    () => ({
      openDrawer,
      closeDrawer,
    }),
    [openDrawer, closeDrawer],
  );

  return (
    <DrawerContext.Provider value={value}>
      {children}
      {isAuthenticated ? (
        <AppDrawer visible={visible} onClose={closeDrawer} onLogout={handleLogout} />
      ) : null}
    </DrawerContext.Provider>
  );
}

export function useDrawer() {
  const context = useContext(DrawerContext);

  if (!context) {
    throw new Error('useDrawer must be used within DrawerProvider');
  }

  return context;
}
