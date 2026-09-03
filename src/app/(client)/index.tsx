import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { BookingsListScreen } from '@/components/cep/bookings-list-screen';
import { ClientJourneyOverview } from '@/components/client-journey-overview';
import { AppHeader } from '@/components/app-header';
import { isExperienceHost } from '@/constants/platforms';
import { Layout, Palette } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useJourney } from '@/context/journey-context';
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
  const { firstName, fullName } = useAuth();
  const { updates, avatarUri, markRead, pickAvatar } = useJourney();

  const journey: JourneySummary = {
    fullName,
    firstName,
    experienceLevel: 'Gold Experience',
    guestCount: 4,
    durationDays: 5,
    travelDates: 'Sep 12—16, 2026',
    destination: 'Montego Bay',
    accommodation: 'Half Moon',
    vehicle: 'AMG GLS 63',
    ceaName: 'Alicia Brown',
    hostName: 'Andre Williams',
    arrival: { airport: 'MBJ', time: '2:35 p.m.' },
    departure: { airport: 'MBJ', time: '10:15 a.m.' },
    journeyStatus: 'finalized',
  };

  return (
    <View style={styles.screen}>
      <AppHeader
        updates={updates}
        avatarUri={avatarUri}
        onAvatarPress={pickAvatar}
        onNotificationPress={(id) => {
          markRead(id);
          router.navigate('/updates');
        }}
      />

      <ClientJourneyOverview
        journey={journey}
        onViewItinerary={() => router.navigate('/itinerary')}
        onExploreAddOns={() => router.navigate('/addons')}
      />
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
});
