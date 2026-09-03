import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ClientJourneyOverview } from '@/components/client-journey-overview';
import { Fonts, Layout, Palette, Spacing } from '@/constants/theme';
import { api } from '@/services/api/client';
import type { BookingListItem, JourneySummary } from '@/services/api/types';

type BookingOverviewScreenProps = {
  bookingId: number;
  onBack: () => void;
};

export function BookingOverviewScreen({ bookingId, onBack }: BookingOverviewScreenProps) {
  const [booking, setBooking] = useState<BookingListItem | null>(null);
  const [journey, setJourney] = useState<JourneySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOverview = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await api.bookingOverview(bookingId);
      setBooking(response.booking);
      setJourney(response.journey);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load booking overview.');
      setBooking(null);
      setJourney(null);
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const clientName = booking
    ? [booking.clientFirst, booking.clientLast].filter(Boolean).join(' ')
    : '';

  return (
    <View style={styles.screen}>
      {booking ? (
        <View style={styles.banner}>
          <View style={styles.bannerRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back to bookings"
              onPress={onBack}
              style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}>
              <Text style={styles.backIcon}>←</Text>
            </Pressable>

            <View style={styles.bannerCopy}>
              <Text style={styles.bannerLabel}>Client view</Text>
              <Text style={styles.bannerRef}>{booking.reference || `#${booking.id}`}</Text>
              <Text style={styles.bannerName}>{clientName}</Text>
              <Text style={styles.bannerMeta}>
                {booking.package} · {journey?.experienceLevel ?? booking.package}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.banner}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to bookings"
            onPress={onBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}>
            <Text style={styles.backIcon}>←</Text>
          </Pressable>
        </View>
      )}

      {isLoading ? (
        <ActivityIndicator color={Palette.green} style={styles.loader} />
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {journey ? (
        <ClientJourneyOverview journey={journey} showGreeting={false} contentStyle={styles.overview} />
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

  banner: {
    backgroundColor: Palette.white,
    borderBottomWidth: 1,
    borderBottomColor: Palette.line,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.sage,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  backButtonPressed: {
    opacity: 0.7,
  },
  backIcon: {
    fontSize: 28,
    lineHeight: 30,
    color: Palette.green,
    fontWeight: '700',
  },
  bannerCopy: {
    flex: 1,
    gap: 4,
  },
  overview: {
    paddingTop: Spacing.three,
  },
  bannerLabel: {
    fontSize: 8,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Palette.muted,
    fontWeight: '700',
  },
  bannerRef: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: Palette.green,
  },
  bannerName: {
    fontFamily: Fonts.serif,
    fontSize: 24,
    color: Palette.ink,
  },
  bannerMeta: {
    color: Palette.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  loader: {
    marginTop: Spacing.four,
  },
  error: {
    marginHorizontal: 18,
    marginTop: Spacing.three,
    color: '#355441',
    backgroundColor: '#EEF3EA',
    borderLeftWidth: 2,
    borderLeftColor: Palette.gold,
    padding: 10,
    fontSize: 11,
    lineHeight: 16,
  },
});
