import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { DriverScreenShell } from '@/components/driver/top-bar';
import { Card, DetailGrid, Eyebrow, PageTitle, Pill } from '@/components/driver/ui';
import { DriverColors } from '@/constants/driver-colors';
import { useDriver } from '@/context/driver-context';
import { driverApi, type ItineraryDay, type TripSummary } from '@/services/api/driver';
import { bookingTripDetails } from '@/utils/driver-trip-details';

function DayCard({ day, initiallyOpen }: { day: ItineraryDay; initiallyOpen?: boolean }) {
  const [open, setOpen] = useState(initiallyOpen ?? false);
  const fields = Object.entries(day.fields ?? {});

  return (
    <Card>
      <Pressable style={styles.dayHead} onPress={() => setOpen((value) => !value)}>
        <View style={{ flex: 1 }}>
          <Text style={styles.dayType}>{day.type}</Text>
          <Text style={styles.dayTitle}>{day.title}</Text>
          <Text style={styles.dayDate}>{day.date}</Text>
        </View>
        <Text style={styles.chev}>{open ? '−' : '＋'}</Text>
      </Pressable>
      {open ? (
        <View style={styles.dayBody}>
          {day.focus ? (
            <View style={styles.detailWide}>
              <Text style={styles.detailLabel}>Primary Activity / Focus</Text>
              <Text style={styles.detailValue}>{day.focus}</Text>
            </View>
          ) : null}
          <DetailGrid
            items={fields.map(([label, value]) => ({
              label,
              value,
            }))}
          />
          {day.attractions?.length ? (
            <View style={{ marginTop: 12 }}>
              <Text style={styles.sectionLabel}>Attractions</Text>
              {day.attractions.map((attraction) => (
                <View key={attraction.name} style={styles.attraction}>
                  <Text style={styles.attractionTitle}>{attraction.name}</Text>
                  <DetailGrid
                    items={[
                      { label: 'Estimated Arrival', value: attraction.estimatedArrival ?? '—' },
                      { label: 'Estimated Departure', value: attraction.estimatedDeparture ?? '—' },
                      {
                        label: 'Tickets / Passes',
                        value: `${attraction.ticketsRequired ?? '—'} · ${attraction.ticketsConfirmed ?? '—'}`,
                      },
                      {
                        label: 'VIP / Fast-Track',
                        value: `${attraction.vipRequired ?? '—'} · ${attraction.vipConfirmed ?? '—'}`,
                      },
                      { label: 'Meal Notes', value: attraction.mealNotes ?? '—' },
                      {
                        label: 'Guest Experience Notes',
                        value: attraction.guestExperienceNotes ?? '—',
                      },
                    ]}
                  />
                </View>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}
    </Card>
  );
}

export default function DriverItineraryScreen() {
  const { dashboard } = useDriver();
  const [view, setView] = useState<'full' | 'days'>('full');
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<{
    summary?: string;
    travelDates?: string;
    movementDays?: number | null;
  }>({});
  const [booking, setBooking] = useState<TripSummary | null>(null);
  const [days, setDays] = useState<ItineraryDay[]>([]);

  const load = useCallback(async () => {
    const tripId = dashboard?.activeTrip?.id;

    if (!tripId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await driverApi.itinerary(tripId);
      setOverview(response.itinerary.overview);
      setBooking(response.itinerary.booking);
      setDays(response.itinerary.days);
    } catch (error) {
      Alert.alert('Unable to load itinerary', error instanceof Error ? error.message : 'Try again.');
    } finally {
      setLoading(false);
    }
  }, [dashboard?.activeTrip?.id]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <DriverScreenShell>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.head}>
          <View>
            <Eyebrow>Finalized by CEA</Eyebrow>
            <PageTitle
              title="Itinerary"
              subtitle={dashboard?.activeTrip?.tripCode ?? undefined}
            />
          </View>
          <Pill tone="gray">READONLY</Pill>
        </View>

        <View style={styles.segment}>
          <Pressable
            style={[styles.segmentBtn, view === 'full' && styles.segmentActive]}
            onPress={() => setView('full')}>
            <Text style={[styles.segmentText, view === 'full' && styles.segmentTextActive]}>
              Full Trip View
            </Text>
          </Pressable>
          <Pressable
            style={[styles.segmentBtn, view === 'days' && styles.segmentActive]}
            onPress={() => setView('days')}>
            <Text style={[styles.segmentText, view === 'days' && styles.segmentTextActive]}>
              Day-by-Day View
            </Text>
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator color={DriverColors.green} />
        ) : view === 'full' ? (
          <>
            <Card>
              <Text style={styles.cardTitle}>Trip Details / Auto-Filled Booking Details</Text>
              {booking ? <DetailGrid items={bookingTripDetails(booking)} /> : null}
            </Card>
            <Card>
              <Text style={styles.cardTitle}>Trip overview</Text>
              <Text style={styles.summary}>
                {overview.summary ??
                  'Assigned trip details are finalized in the CEP Itinerary Builder.'}
              </Text>
              <DetailGrid
                items={[
                  { label: 'Travel Dates', value: overview.travelDates ?? '—' },
                  {
                    label: 'Movement Days',
                    value: overview.movementDays ? `${overview.movementDays} planned days` : '—',
                  },
                ]}
              />
            </Card>
          </>
        ) : days.length ? (
          days.map((day, index) => (
            <DayCard key={`${day.date}-${day.title}`} day={day} initiallyOpen={index === 0} />
          ))
        ) : (
          <Card>
            <Text style={styles.summary}>No itinerary days are scheduled for this trip yet.</Text>
          </Card>
        )}
      </ScrollView>
    </DriverScreenShell>
  );
}

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: DriverColors.segmentBg,
    padding: 4,
    borderRadius: 13,
    marginBottom: 14,
  },
  segmentBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: DriverColors.paper,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '800',
    color: DriverColors.muted,
  },
  segmentTextActive: {
    color: DriverColors.green,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: DriverColors.ink,
    marginBottom: 12,
  },
  summary: {
    fontSize: 13,
    lineHeight: 20,
    color: DriverColors.muted,
    marginBottom: 12,
  },
  dayHead: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayType: {
    color: DriverColors.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: DriverColors.ink,
  },
  dayDate: {
    fontSize: 11,
    color: DriverColors.muted,
  },
  chev: {
    color: DriverColors.gold,
    fontSize: 18,
  },
  dayBody: {
    borderTopWidth: 1,
    borderTopColor: DriverColors.line,
    marginTop: 13,
    paddingTop: 13,
  },
  detailWide: {
    marginBottom: 12,
  },
  detailLabel: {
    color: DriverColors.muted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  detailValue: {
    color: DriverColors.ink,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: DriverColors.ink,
    marginBottom: 8,
  },
  attraction: {
    backgroundColor: DriverColors.attractionBg,
    padding: 12,
    borderRadius: 13,
    marginBottom: 10,
  },
  attractionTitle: {
    fontWeight: '700',
    color: DriverColors.ink,
    marginBottom: 8,
  },
});
