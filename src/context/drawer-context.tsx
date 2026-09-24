import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { AppDrawer } from '@/components/app-drawer';
import { AppDialog } from '@/components/ui/app-dialog';
import { useAuth } from '@/context/auth-context';
import { resetToLanding } from '@/lib/navigation';

type DrawerContextValue = {
  openDrawer: () => void;
  closeDrawer: () => void;
};

const DrawerContext =
  createContext<DrawerContextValue | null>(null);

export function DrawerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { logout, isAuthenticated } = useAuth();
  const [visible, setVisible] = useState(false);

  const [logoutDialogVisible, setLogoutDialogVisible] =
    useState(false);

  const openDrawer = useCallback(() => {
    setVisible(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setVisible(false);
  }, []);

  const handleLogout = useCallback(() => {
    setLogoutDialogVisible(true);
  }, []);

  const closeLogoutDialog = useCallback(() => {
    setLogoutDialogVisible(false);
  }, []);

  const confirmLogout = useCallback(async () => {
    setLogoutDialogVisible(false);
    closeDrawer();

    await logout();
    resetToLanding();
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
        <>
          <AppDrawer
            visible={visible}
            onClose={closeDrawer}
            onLogout={handleLogout}
          />

          <AppDialog
            visible={logoutDialogVisible}
            title="Log out"
            message="Sign out of Tour Jamaica?"
            confirmLabel="Log out"
            cancelLabel="Cancel"
            onConfirm={() => {
              void confirmLogout();
            }}
            onCancel={closeLogoutDialog}
          />
        </>
      ) : null}
    </DrawerContext.Provider>
  );
}

export function useDrawer() {
  const context = useContext(DrawerContext);

  if (!context) {
    throw new Error(
      'useDrawer must be used within DrawerProvider',
    );
  }

  return context;
}