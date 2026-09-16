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

  const isBookingClient =
    role === 'client' &&
    bookingId != null;

  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  /**
   * Fetch the authenticated client's journey updates.
   *
   * Laravel resolves the booking from the Sanctum token,
   * so we do not send bookingId in this request.
   */
  const refreshUpdates = useCallback(async () => {
    if (!isBookingClient) {
      setUpdates([]);
      return;
    }

    try {
      const response = await api.notifications();

      setUpdates(response.updates ?? []);
    } catch (error) {
      console.error(
        'Unable to load journey updates:',
        error,
      );

      setUpdates([]);
    }
  }, [isBookingClient]);

  /**
   * Load updates whenever the authenticated booking changes
   * or the provider is first mounted.
   */
  useEffect(() => {
    void refreshUpdates();
  }, [refreshUpdates]);

  /**
   * Mark one notification as read.
   *
   * The id returned by Laravel is also the notification key:
   *
   * cep:123
   * addon:42:Awaiting Payment
   * addon:42:Confirmed
   */
  const markRead = useCallback(
    async (id: string) => {
      if (!isBookingClient) {
        return;
      }

      // Optimistically update the UI.
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

      try {
        await api.markNotificationRead(id);

        // Refresh so the app reflects the server state.
        await refreshUpdates();
      } catch (error) {
        console.error(
          'Unable to mark journey update as read:',
          error,
        );

        // Reload from Laravel so a failed request does not
        // permanently leave the local state out of sync.
        await refreshUpdates();
      }

      setTimeout(() => {
        setHighlightId((current) =>
          current === id ? null : current,
        );
      }, 2200);
    },
    [isBookingClient, refreshUpdates],
  );

  const pickAvatar = useCallback(async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

    if (
      !result.canceled &&
      result.assets[0]
    ) {
      setAvatarUri(
        result.assets[0].uri,
      );
    }
  }, []);

  const unreadCount = useMemo(
    () =>
      updates.filter(
        (item) => item.unread,
      ).length,
    [updates],
  );

  const value =
    useMemo<JourneyContextValue>(
      () => ({
        updates,
        highlightId,
        avatarUri,
        unreadCount,
        refreshUpdates,
        markRead,
        pickAvatar,
      }),
      [
        updates,
        highlightId,
        avatarUri,
        unreadCount,
        refreshUpdates,
        markRead,
        pickAvatar,
      ],
    );

  return (
    <JourneyContext.Provider value={value}>
      {children}
    </JourneyContext.Provider>
  );
}

export function useJourney() {
  const context =
    useContext(JourneyContext);

  if (!context) {
    throw new Error(
      'useJourney must be used within JourneyProvider',
    );
  }

  return context;
}