import { BrandHeader } from '@/components/brand-header';
import { BookingOverviewScreen } from '@/components/cep/booking-overview-screen';
import { EyebrowText, SerifTitle } from '@/components/ui/typography';
import { Fonts, Layout, Palette, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { api } from '@/services/api/client';
import type { BookingListItem } from '@/services/api/types';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

function BookingCard({
  booking,
  onPress,
}: {
  booking: BookingListItem;
  onPress: () => void;
}) {
  const clientName = [booking.clientFirst, booking.clientLast].filter(Boolean).join(' ');

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.card, booking.needsAttention && styles.cardAttention]}>
      <View style={styles.cardTop}>
        <Text style={styles.reference}>{booking.reference || `#${booking.id}`}</Text>
        {booking.needsAttention ? <Text style={styles.attention}>Attention</Text> : null}
      </View>

      <Text style={styles.clientName}>{clientName || 'Client name pending'}</Text>
      <Text style={styles.muted}>{booking.vehicle}</Text>

      <View style={styles.metaRow}>
        <View style={styles.metaBlock}>
          <Text style={styles.metaLabel}>Package</Text>
          <Text style={styles.metaValue}>{booking.package}</Text>
        </View>
        <View style={styles.metaBlock}>
          <Text style={styles.metaLabel}>Dates</Text>
          <Text style={styles.metaValue}>{booking.dates}</Text>
          {booking.duration != null ? (
            <Text style={styles.muted}>{booking.duration} days</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.statusPill}>
        <Text style={styles.statusText}>{booking.bookingStatus || booking.status}</Text>
      </View>
    </Pressable>
  );
}

export function BookingsListScreen() {
  const { firstName, roleLabel, logout } = useAuth();
  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogout = async () => {
  await logout();
  router.replace('/login');
  };

  const loadBookings = useCallback(async (refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setError('');

    try {
      const response = await api.bookings();
      setBookings(response.bookings);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load bookings.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  if (selectedBookingId !== null) {
    return (
      <BookingOverviewScreen
        bookingId={selectedBookingId}
        onBack={() => setSelectedBookingId(null)}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <BrandHeader compact />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{firstName.charAt(0).toUpperCase()}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => loadBookings(true)} />
        }>
        <EyebrowText>EXPERIENCE DESK</EyebrowText>
        <SerifTitle size="page">Bookings</SerifTitle>
        <Text style={styles.subtitle}>
          {roleLabel} · {bookings.length} completed {bookings.length === 1 ? 'journey' : 'journeys'}
        </Text>

        {__DEV__ && (
          <Pressable onPress={handleLogout} style={styles.devLogout}>
            <Text style={styles.devLogoutText}>DEV: Log Out</Text>
          </Pressable>
        )}

        {isLoading ? (
          <ActivityIndicator color={Palette.green} style={styles.loader} />
        ) : null}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {!isLoading && !error && bookings.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No bookings yet</Text>
            <Text style={styles.emptyBody}>Completed journey requests will appear here.</Text>
          </View>
        ) : null}

        <View style={styles.list}>
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onPress={() => setSelectedBookingId(booking.id)}
            />
          ))}
        </View>
      </ScrollView>
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
  header: {
    backgroundColor: Palette.paper,
    borderBottomWidth: 1,
    borderBottomColor: Palette.line,
    height: Layout.headerHeight,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Palette.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.green,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: Layout.bottomNavHeight + Spacing.five,
    gap: Spacing.three,
  },
  subtitle: {
    color: Palette.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  loader: {
    marginTop: Spacing.four,
  },
  error: {
    color: '#355441',
    backgroundColor: '#EEF3EA',
    borderLeftWidth: 2,
    borderLeftColor: Palette.gold,
    padding: 10,
    fontSize: 11,
    lineHeight: 16,
  },
  empty: {
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.line,
    borderRadius: 8,
    padding: 24,
    gap: 8,
    marginTop: Spacing.two,
  },
  emptyTitle: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    color: Palette.ink,
  },
  emptyBody: {
    color: Palette.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  list: {
    gap: 10,
    marginTop: Spacing.two,
  },
  card: {
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.line,
    borderRadius: 8,
    padding: 18,
    gap: 8,
  },
  cardAttention: {
    borderLeftWidth: 3,
    borderLeftColor: Palette.gold,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reference: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: Palette.green,
  },
  attention: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: Palette.gold,
  },
  clientName: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    color: Palette.ink,
  },
  muted: {
    color: Palette.muted,
    fontSize: 11,
    lineHeight: 16,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
  },
  metaBlock: {
    flex: 1,
    gap: 4,
  },
  metaLabel: {
    fontSize: 7,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Palette.muted,
    fontWeight: '700',
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.ink,
  },
  statusPill: {
    alignSelf: 'flex-start',
    backgroundColor: Palette.sage,
    borderRadius: Layout.borderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 4,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
    color: Palette.green,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
    devLogout: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Palette.line,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Palette.paper,
  },

  devLogoutText: {
    fontSize: 10,
    fontWeight: '800',
    color: Palette.green,
    letterSpacing: 0.8,
  },
});
