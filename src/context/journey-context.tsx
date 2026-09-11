import * as ImagePicker from 'expo-image-picker';
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  ADDONS,
  INITIAL_UPDATES,
  type Addon,
  type Update,
} from '@/constants/mock-data';
import { useUpdatesState } from '@/hooks/use-journey-state';

type JourneyContextValue = {
  updates: Update[];
  addons: Addon[];
  highlightId: number | null;
  avatarUri: string | null;
  unreadCount: number;
  markRead: (id: number) => void;
  addUpdate: (message: string, kind: string, from?: string) => void;
  requestAddon: (id: number) => void;
  confirmPayment: (id: number) => void;
  pickAvatar: () => Promise<void>;
};

const JourneyContext = createContext<JourneyContextValue | null>(null);

export function JourneyProvider({ children }: { children: ReactNode }) {
  const {
    updates,
    unreadCount,
    highlightId,
    markRead,
    addUpdate,
  } = useUpdatesState(INITIAL_UPDATES ?? []);

  const [addons, setAddons] = useState<Addon[]>(ADDONS ?? []);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const requestAddon = (id: number) => {
    setAddons((current) =>
      current.map((addon) =>
        addon.id === id
          ? {
              ...addon,
              status: 'Processing',
            }
          : addon,
      ),
    );

    addUpdate(
      'Your add-on request is being reviewed by your CEA.',
      'Add-on request update',
    );
  };

  const confirmPayment = (id: number) => {
    setAddons((current) =>
      current.map((addon) =>
        addon.id === id
          ? {
              ...addon,
              status: 'Confirmed',
            }
          : addon,
      ),
    );

    addUpdate(
      'Your add-on payment is confirmed.',
      'Payment confirmed',
    );
  };

  const pickAvatar = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

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

  const value = useMemo<JourneyContextValue>(
    () => ({
      updates,
      addons,
      highlightId,
      avatarUri,
      unreadCount,
      markRead,
      addUpdate,
      requestAddon,
      confirmPayment,
      pickAvatar,
    }),
    [
      updates,
      addons,
      highlightId,
      avatarUri,
      unreadCount,
      markRead,
      addUpdate,
    ],
  );

  return (
    <JourneyContext.Provider value={value}>
      {children}
    </JourneyContext.Provider>
  );
}

export function useJourney() {
  const context = useContext(JourneyContext);

  if (!context) {
    throw new Error('useJourney must be used within JourneyProvider');
  }

  return context;
}