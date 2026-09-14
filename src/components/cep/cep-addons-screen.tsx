import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AddonsCatalog } from '@/components/addons-catalog';
import { BrandHeader } from '@/components/brand-header';
import { DrawerMenuButton } from '@/components/drawer-menu-button';
import { Fonts, Layout, Palette, Spacing } from '@/constants/theme';
import { api } from '@/services/api/client';
import type { AddOnItem, BookingListItem, JourneySummary } from '@/services/api/types';

type BookingPickerProps = {
  bookings: BookingListItem[];
  selectedId: number | null;
  onSelect: (bookingId: number) => void;
};

function BookingPicker({ bookings, selectedId, onSelect }: BookingPickerProps) {
  const [open, setOpen] = useState(false);
  const selected = bookings.find((booking) => booking.id === selectedId);

  const label = selected
    ? `${selected.reference || `#${selected.id}`} · ${selected.clientFirst} ${selected.clientLast}`.trim()
    : 'Choose a booking';

  return (
    <>
      <Pressable accessibilityRole="button" onPress={() => setOpen(true)} style={styles.picker}>
        <View style={styles.pickerCopy}>
          <Text style={styles.pickerLabel}>Selected booking</Text>
          <Text style={styles.pickerValue}>{label}</Text>
        </View>
        <Text style={styles.pickerChevron}>▾</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.modalBackdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.modalSheet} onPress={(event) => event.stopPropagation()}>
            <Text style={styles.modalTitle}>Choose booking</Text>
            <ScrollView style={styles.modalList}>
              {bookings.map((booking) => {
                const clientName = [booking.clientFirst, booking.clientLast].filter(Boolean).join(' ');
                const active = booking.id === selectedId;

                return (
                  <Pressable
                    key={booking.id}
                    accessibilityRole="button"
                    onPress={() => {
                      onSelect(booking.id);
                      setOpen(false);
                    }}
                    style={[styles.modalItem, active && styles.modalItemActive]}>
                    <Text style={styles.modalRef}>{booking.reference || `#${booking.id}`}</Text>
                    <Text style={styles.modalClient}>{clientName}</Text>
                    <Text style={styles.modalMeta}>
                      {booking.package} · {booking.dates}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function BookingSummary({
  booking,
  journey,
}: {
  booking: BookingListItem;
  journey: JourneySummary;
}) {
  const clientName = [booking.clientFirst, booking.clientLast].filter(Boolean).join(' ');

  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryTop}>
        <View>
          <Text style={styles.summaryLabel}>Client journey</Text>
          <Text style={styles.summaryName}>{clientName}</Text>
        </View>
        <Text style={styles.summaryRef}>{booking.reference || `#${booking.id}`}</Text>
      </View>
      <Text style={styles.summaryMeta}>
        {journey.experienceLevel} · {journey.travelDates} · {journey.guestCount} guests
      </Text>
      <Text style={styles.summaryMeta}>
        {journey.accommodation} · {journey.vehicle}
      </Text>
      <View style={styles.summaryStatus}>
        <Text style={styles.summaryStatusText}>{booking.bookingStatus || booking.status}</Text>
      </View>
    </View>
  );
}

export function CepAddonsScreen() {
  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [addOns, setAddOns] = useState<AddOnItem[]>([]);
  const [journey, setJourney] = useState<JourneySummary | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingListItem | null>(null);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [isLoadingAddOns, setIsLoadingAddOns] = useState(false);
  const [error, setError] = useState('');

  const loadBookings = useCallback(async () => {
    setIsLoadingBookings(true);
    setError('');

    try {
      const response = await api.bookings();
      setBookings(response.bookings);

      if (response.bookings.length > 0) {
        setSelectedBookingId((current) => current ?? response.bookings[0].id);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load bookings.');
    } finally {
      setIsLoadingBookings(false);
    }
  }, []);

  const loadAddOns = useCallback(async (bookingId: number) => {
    setIsLoadingAddOns(true);
    setError('');

    try {
      const response = await api.bookingAddOns(bookingId);
      setAddOns(response.addOns);
      setJourney(response.journey);
      setSelectedBooking(response.booking);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load add-ons.');
      setAddOns([]);
      setJourney(null);
      setSelectedBooking(null);
    } finally {
      setIsLoadingAddOns(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  useEffect(() => {
    if (selectedBookingId !== null) {
      loadAddOns(selectedBookingId);
    }
  }, [loadAddOns, selectedBookingId]);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <DrawerMenuButton />
        <BrandHeader compact />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isLoadingBookings ? <ActivityIndicator color={Palette.green} style={styles.loader} /> : null}

        {bookings.length > 0 ? (
          <BookingPicker
            bookings={bookings}
            selectedId={selectedBookingId}
            onSelect={setSelectedBookingId}
          />
        ) : null}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {isLoadingAddOns ? <ActivityIndicator color={Palette.green} style={styles.loader} /> : null}

        {selectedBooking && journey ? (
          <BookingSummary booking={selectedBooking} journey={journey} />
        ) : null}

        {!isLoadingAddOns && addOns.length > 0 ? (
          <AddonsCatalog
            addOns={addOns}
            readOnly
            subtitle="Review add-on availability and request status for the selected booking."
          />
        ) : null}

        {!isLoadingAddOns && selectedBookingId !== null && addOns.length === 0 && !error ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No add-ons to show</Text>
            <Text style={styles.emptyBody}>This booking has no catalog items yet.</Text>
          </View>
        ) : null}
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
    gap: 4,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: Layout.bottomNavHeight + Spacing.five,
    gap: Spacing.four,
  },
  loader: {
    marginTop: Spacing.two,
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
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.line,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  pickerCopy: {
    flex: 1,
    gap: 4,
  },
  pickerLabel: {
    fontSize: 8,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Palette.muted,
    fontWeight: '700',
  },
  pickerValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.ink,
  },
  pickerChevron: {
    color: Palette.green,
    fontSize: 16,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(14,33,27,0.55)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Palette.paper,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%',
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 24,
  },
  modalTitle: {
    fontFamily: Fonts.serif,
    fontSize: 24,
    color: Palette.ink,
    marginBottom: 12,
  },
  modalList: {
    maxHeight: 420,
  },
  modalItem: {
    borderWidth: 1,
    borderColor: Palette.line,
    backgroundColor: Palette.white,
    padding: 14,
    marginBottom: 8,
    gap: 4,
  },
  modalItemActive: {
    borderColor: Palette.green,
    backgroundColor: '#F8FBF7',
  },
  modalRef: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: Palette.green,
  },
  modalClient: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    color: Palette.ink,
  },
  modalMeta: {
    fontSize: 11,
    color: Palette.muted,
  },
  summaryCard: {
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.line,
    borderRadius: 8,
    padding: 18,
    gap: 8,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  summaryLabel: {
    fontSize: 8,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Palette.muted,
    fontWeight: '700',
  },
  summaryName: {
    fontFamily: Fonts.serif,
    fontSize: 24,
    color: Palette.ink,
  },
  summaryRef: {
    fontSize: 10,
    fontWeight: '800',
    color: Palette.green,
  },
  summaryMeta: {
    fontSize: 12,
    color: Palette.muted,
    lineHeight: 18,
  },
  summaryStatus: {
    alignSelf: 'flex-start',
    backgroundColor: Palette.sage,
    borderRadius: Layout.borderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 4,
  },
  summaryStatusText: {
    fontSize: 9,
    fontWeight: '700',
    color: Palette.green,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  empty: {
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.line,
    borderRadius: 8,
    padding: 24,
    gap: 8,
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
});
