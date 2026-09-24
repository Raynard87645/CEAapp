import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { DriverScreenShell } from '@/components/driver/top-bar';
import {
  Card,
  DetailGrid,
  Eyebrow,
  PageTitle,
  Pill,
} from '@/components/driver/ui';
import { AppDialog } from '@/components/ui/app-dialog';
import { DriverColors } from '@/constants/driver-colors';
import { useDriver } from '@/context/driver-context';
import {
  driverApi,
  type TripSummary,
} from '@/services/api/driver';
import {
  coreTripDetails,
  ftsServiceDetails,
} from '@/utils/driver-trip-details';

function TripCard({ trip }: { trip: TripSummary }) {
  return (
    <Card>
      <View style={styles.cardHead}>
        <View style={styles.cardTitleWrap}>
          <Text style={styles.cardTitle}>{trip.clientName}</Text>
          <Text style={styles.tripCode}>{trip.tripCode}</Text>
        </View>

        <Pill tone="green">{trip.status.toUpperCase()}</Pill>
      </View>

      <DetailGrid items={coreTripDetails(trip)} />
      <DetailGrid items={ftsServiceDetails(trip)} />

      <View style={styles.prepNote}>
        <Text style={styles.prepTitle}>Pickup preparation</Text>
        <Text style={styles.prepBody}>
          {trip.prepNote ??
            'Montego Bay: 1 hour before arrival · Kingston: 4 hours before arrival for vehicle, kit, beverage and punctuality checks.'}
        </Text>
      </View>

      <Pressable
        style={styles.primaryBtn}
        onPress={() => router.push('/(driver)/itinerary')}
        accessibilityRole="button"
        accessibilityLabel={`View itinerary for ${trip.clientName}`}>
        <Text style={styles.primaryText}>View Itinerary</Text>
      </Pressable>
    </Card>
  );
}

export default function DriverTripsScreen() {
  const { dashboard } = useDriver();
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const [dialog, setDialog] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const response = await driverApi.trips();
      setTrips(response.trips);
    } catch (error) {
      setDialog({
        visible: true,
        title: 'Unable to load trips',
        message:
          error instanceof Error ? error.message : 'Try again.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visibleTrips = trips.length
    ? trips
    : dashboard?.activeTrip
      ? [dashboard.activeTrip]
      : [];

  const totalTrips = visibleTrips.length;
  const displayedTrips = visibleTrips.slice(0, 3);

  const closeDialog = () => {
    setDialog((current) => ({
      ...current,
      visible: false,
    }));
  };

  return (
    <DriverScreenShell>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.head}>
          <View style={styles.headCopy}>
            <Eyebrow>Assigned movements</Eyebrow>

            <PageTitle
              title="Trips"
              subtitle={`Read-only trip details from FTS.\nViewing ${displayedTrips.length} of ${totalTrips}`}
            />
          </View>

          <Pill tone="green">
            {visibleTrips.length ? `${visibleTrips.length} ACTIVE` : 'NONE'}
          </Pill>
        </View>

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={DriverColors.green} />
          </View>
        ) : visibleTrips.length ? (
          displayedTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))
        ) : (
          <Card>
            <Text style={styles.empty}>No trips assigned yet.</Text>
          </Card>
        )}
      </ScrollView>

      <AppDialog
        visible={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        confirmLabel="OK"
        onConfirm={closeDialog}
        onCancel={closeDialog}
      />
    </DriverScreenShell>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
  },

  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },

  headCopy: {
    flex: 1,
    paddingRight: 12,
  },

  cardHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },

  cardTitleWrap: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: DriverColors.ink,
  },

  tripCode: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
    color: DriverColors.gold,
    letterSpacing: 0.4,
  },

  prepNote: {
    backgroundColor: DriverColors.prepNote,
    borderLeftWidth: 3,
    borderLeftColor: DriverColors.gold,
    padding: 11,
    borderRadius: 8,
    marginVertical: 14,
  },

  prepTitle: {
    fontWeight: '700',
    color: DriverColors.ink,
    marginBottom: 4,
  },

  prepBody: {
    fontSize: 11,
    lineHeight: 16,
    color: DriverColors.ink,
  },

  primaryBtn: {
    backgroundColor: DriverColors.green,
    borderRadius: 14,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryText: {
    color: '#fff',
    fontWeight: '800',
  },

  loading: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  empty: {
    color: DriverColors.muted,
    fontSize: 14,
  },
});