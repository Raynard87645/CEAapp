import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { api, getAuthToken, setAuthToken } from '@/services/api/client';
import type { UserRole } from '@/services/api/types';
import { normalizeAppRole } from '@/constants/platforms';

export type { UserRole } from '@/services/api/types';

type AuthContextValue = {
  role: UserRole | null;
  firstName: string;
  fullName: string;
  bookingId: number | null;
  roleLabel: string;
  platformLabel: string;
  primaryRole: string | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  hasCompletedWelcome: boolean;
  login: (
    firstName: string,
    lastName: string,
    loginToken: string,
  ) => Promise<{ success: boolean; error?: string }>;
  completeWelcome: () => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [firstName, setFirstName] = useState('');
  const [fullName, setFullName] = useState('');
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [roleLabel, setRoleLabel] = useState('');
  const [platformLabel, setPlatformLabel] = useState('');
  const [primaryRole, setPrimaryRole] = useState<string | null>(null);
  const [hasCompletedWelcome, setHasCompletedWelcome] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
        const token = await getAuthToken();
        if (!token) return;

        const profile = await api.me();
        if (cancelled) return;

        setRole(normalizeAppRole(profile.role));
        setFirstName(profile.firstName);
        setFullName(profile.fullName);
        setBookingId(profile.bookingId);
        setRoleLabel(profile.roleLabel);
        setPlatformLabel(profile.platformLabel);
        setPrimaryRole(profile.primaryRole);
        setHasCompletedWelcome(true);
      } catch {
        await setAuthToken(null);
      } finally {
        if (!cancelled) {
          setIsBootstrapping(false);
        }
      }
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (rawFirst: string, rawLast: string, loginToken: string) => {
    const first = rawFirst.trim();
    const last = rawLast.trim();

    if (!first) {
      return { success: false, error: 'Please enter your first name.' };
    }

    if (!last) {
      return { success: false, error: 'Please enter your last name.' };
    }

    if (!loginToken.trim()) {
      return { success: false, error: 'Please enter your passcode.' };
    }

    try {
      const result = await api.login(first, last, loginToken);
      await setAuthToken(result.token);

      setRole(normalizeAppRole(result.role));
      setFirstName(result.firstName);
      setFullName(result.fullName);
      setBookingId(result.bookingId);
      setRoleLabel(result.roleLabel);
      setPlatformLabel(result.platformLabel);
      setPrimaryRole(result.primaryRole);
      setHasCompletedWelcome(false);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unable to sign in.',
      };
    }
  }, []);

  const completeWelcome = useCallback(() => {
    setHasCompletedWelcome(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      // Clear local session even if the server is unreachable.
    } finally {
      await setAuthToken(null);
      setRole(null);
      setFirstName('');
      setFullName('');
      setBookingId(null);
      setRoleLabel('');
      setPlatformLabel('');
      setPrimaryRole(null);
      setHasCompletedWelcome(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      role,
      firstName,
      fullName,
      bookingId,
      roleLabel,
      platformLabel,
      primaryRole,
      isAuthenticated: role !== null,
      isBootstrapping,
      hasCompletedWelcome,
      login,
      completeWelcome,
      logout,
    }),
    [
      role,
      firstName,
      fullName,
      bookingId,
      roleLabel,
      platformLabel,
      primaryRole,
      isBootstrapping,
      hasCompletedWelcome,
      login,
      completeWelcome,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
