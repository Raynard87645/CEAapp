import * as ImagePicker from 'expo-image-picker';
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
import { api } from '@/services/api/client';
import type { UpdateItem } from '@/services/api/types';

type JourneyContextValue = {
  updates: UpdateItem[];
  highlightId: string | null;
  avatarUri: string | null;
  unreadCount: number;
  refreshUpdates: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  pickAvatar: () => Promise<void>;
};

const JourneyContext = createContext<JourneyContextValue | null>(null);

export function JourneyProvider({ children }: { children: ReactNode }) {
  const { bookingId, role } = useAuth();
  const isBookingClient = role === 'client' && bookingId != null;

  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const refreshUpdates = useCallback(async () => {
    if (!isBookingClient || !bookingId) {
      setUpdates([]);
      return;
    }

    try {
      const response = await api.bookingNotifications(bookingId);
      setUpdates(response.updates ?? []);
    } catch {
      setUpdates([]);
    }
  }, [bookingId, isBookingClient]);

  useEffect(() => {
    void refreshUpdates();
  }, [refreshUpdates]);

  const markRead = useCallback(
    async (id: string) => {
      setUpdates((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                unread: false,
              }
            : item,
        ),
      );

      setHighlightId(id);

      if (isBookingClient && bookingId) {
        try {
          await api.markBookingNotificationRead(bookingId, id);
          await refreshUpdates();
        } catch {
          // Keep optimistic read state if the server is unreachable.
        }
      }

      setTimeout(() => {
        setHighlightId(null);
      }, 2200);
    },
    [bookingId, isBookingClient, refreshUpdates],
  );

  const pickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const unreadCount = useMemo(
    () => updates.filter((item) => item.unread).length,
    [updates],
  );

  const value = useMemo<JourneyContextValue>(
    () => ({
      updates,
      highlightId,
      avatarUri,
      unreadCount,
      refreshUpdates,
      markRead,
      pickAvatar,
    }),
    [updates, highlightId, avatarUri, unreadCount, refreshUpdates, markRead],
  );

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
}

export function useJourney() {
  const context = useContext(JourneyContext);

  if (!context) {
    throw new Error('useJourney must be used within JourneyProvider');
  }

  return context;
}
