import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { PASSCODE } from '@/constants/mock-data';

export type UserRole = 'client' | 'host';

type AuthContextValue = {
  role: UserRole | null;
  firstName: string;
  fullName: string;
  isAuthenticated: boolean;
  hasCompletedWelcome: boolean;
  login: (firstName: string, lastName: string, passcode: string) => { success: boolean; error?: string };
  completeWelcome: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function capitalize(value: string) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildFullName(firstName: string, lastName: string) {
  return [capitalize(firstName.trim()), capitalize(lastName.trim())].filter(Boolean).join(' ');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [firstName, setFirstName] = useState('');
  const [fullName, setFullName] = useState('');
  const [hasCompletedWelcome, setHasCompletedWelcome] = useState(false);

  const login = useCallback((rawFirst: string, rawLast: string, passcode: string) => {
    const first = rawFirst.trim();
    const last = rawLast.trim();

    if (!first) {
      return { success: false, error: 'Please enter your first name.' };
    }

    if (passcode !== PASSCODE) {
      return {
        success: false,
        error: 'Please check your name and passcode.',
      };
    }

    const normalizedFirst = capitalize(first);
    const normalizedFull = buildFullName(first, last);

    const isHost =
      first.toLowerCase() === 'andre' && last.toLowerCase() === 'williams';

    setRole(isHost ? 'host' : 'client');
    setFirstName(normalizedFirst);
    setFullName(normalizedFull || normalizedFirst);
    setHasCompletedWelcome(false);

    return { success: true };
  }, []);

  const completeWelcome = useCallback(() => {
    setHasCompletedWelcome(true);
  }, []);

  const logout = useCallback(() => {
    setRole(null);
    setFirstName('');
    setFullName('');
    setHasCompletedWelcome(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      role,
      firstName,
      fullName,
      isAuthenticated: role !== null,
      hasCompletedWelcome,
      login,
      completeWelcome,
      logout,
    }),
    [role, firstName, fullName, hasCompletedWelcome, login, completeWelcome, logout],
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
