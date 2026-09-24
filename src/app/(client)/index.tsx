import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AppHeader } from '@/components/app-header';
import { BookingsListScreen } from '@/components/cep/bookings-list-screen';
import { ClientJourneyOverview } from '@/components/client-journey-overview';
import { isExperienceHost } from '@/constants/platforms';
import { Layout, Palette } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useJourney } from '@/context/journey-context';
import { api } from '@/services/api/client';
import type { JourneySummary } from '@/services/api/types';

export default function ClientIndexScreen() {
  const { role } = useAuth();

  if (isExperienceHost(role)) {
    return <BookingsListScreen />;
  }

  return <ClientHomeScreen />;
}

function ClientHomeScreen() {
  const router = useRouter();

  const { bookingId } = useAuth();
  const { avatarUri, pickAvatar } = useJourney();

  const [journey, setJourney] =
    useState<JourneySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadJourney() {
      if (!bookingId) {
        if (active) {
          setError(
            'No booking is linked to this login.',
          );
          setLoading(false);
        }

        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response =
          await api.bookingOverview(bookingId);

        if (active) {
          setJourney(response.journey);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load your trip details.',
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadJourney();

    return () => {
      active = false;
    };
  }, [bookingId]);

  return (
    <View style={styles.screen}>
      <AppHeader
        avatarUri={avatarUri}
        onAvatarPress={pickAvatar}
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text>{error}</Text>
        </View>
      ) : journey ? (
        <ClientJourneyOverview
          journey={journey}
          onViewItinerary={() =>
            router.navigate('/itinerary')
          }
          onExploreAddOns={() =>
            router.navigate('/addons')
          }
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.cream,
    maxWidth: Layout.maxWidth,
    width: '100%',
    alignSelf: 'center',
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});