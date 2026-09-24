import { AppHeader } from '@/components/app-header';
import { EyebrowText, SerifTitle } from '@/components/ui/typography';
import { Fonts, Layout, Palette, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useJourney } from '@/context/journey-context';
import { api } from '@/services/api/client';
import type {
  ItineraryEvent,
  JourneySummary,
} from '@/services/api/types';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function ItineraryScreen() {
  const { avatarUri, pickAvatar } = useJourney();
  const { bookingId, fullName } = useAuth();

  const [viewMode, setViewMode] = useState<'full' | 'day'>('full');
  const [journey, setJourney] =
    useState<JourneySummary | null>(null);
  const [itinerary, setItinerary] =
    useState<ItineraryEvent[]>([]);
  const [selectedDay, setSelectedDay] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadItinerary() {
      if (!bookingId) {
        if (active) {
          setError('No booking is linked to this login.');
          setLoading(false);
        }

        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [
          bookingResponse,
          itineraryResponse,
        ] = await Promise.all([
          api.bookingOverview(bookingId),
          api.bookingItinerary(bookingId),
        ]);

        if (!active) {
          return;
        }

        const itineraryData =
          itineraryResponse.itinerary ?? [];

        setJourney(bookingResponse.journey);
        setItinerary(itineraryData);

        if (itineraryData.length > 0) {
          setSelectedDay(itineraryData[0].day);
        }
      } catch (err) {
        if (!active) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load your itinerary.',
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadItinerary();

    return () => {
      active = false;
    };
  }, [bookingId]);

  const selectedItineraryDay = useMemo(
    () =>
      itinerary.find(
        (item) => item.day === selectedDay,
      ),
    [itinerary, selectedDay],
  );

  return (
    <View style={styles.screen}>
      <AppHeader
        avatarUri={avatarUri}
        onAvatarPress={pickAvatar}
      />

      {loading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator />

          <Text style={styles.loadingText}>
            Loading your itinerary...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.loadingState}>
          <Text style={styles.errorText}>
            {error}
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.head}>
            <EyebrowText>
              {journey
                ? `${journey.travelDates} · ${journey.guestCount} ${
                    journey.guestCount === 1
                      ? 'Guest'
                      : 'Guests'
                  }`
                : 'YOUR JAMAICA EXPERIENCE'}
            </EyebrowText>

            <SerifTitle size="page">
              Your
              <Text style={styles.accent}>
                {' '}itinerary
              </Text>
            </SerifTitle>

            <Text style={styles.subtitle}>
              Every movement, thoughtfully arranged.
            </Text>
          </View>

          <View style={styles.viewSwitcher}>
            <Pressable
              onPress={() => setViewMode('full')}
              style={[
                styles.viewSwitcherButton,
                viewMode === 'full' &&
                  styles.viewSwitcherButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.viewSwitcherText,
                  viewMode === 'full' &&
                    styles.viewSwitcherTextActive,
                ]}
              >
                FULL TRIP
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setViewMode('day')}
              style={[
                styles.viewSwitcherButton,
                viewMode === 'day' &&
                  styles.viewSwitcherButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.viewSwitcherText,
                  viewMode === 'day' &&
                    styles.viewSwitcherTextActive,
                ]}
              >
                DAY BY DAY
              </Text>
            </Pressable>
          </View>

          <View style={styles.tripOverview}>
            <Text style={styles.tripOverviewTitle}>
              Trip Overview
            </Text>

            <Text style={styles.guestName}>
              {journey?.fullName || fullName}
            </Text>

            <View style={styles.tripDetailsGrid}>
              <View style={styles.tripFact}>
                <Text style={styles.tripFactLabel}>
                  PACKAGE LEVEL
                </Text>

                <Text style={styles.tripFactValue}>
                  {journey?.experienceLevel ||
                    'To be confirmed'}
                </Text>
              </View>

              <View style={styles.tripFact}>
                <Text style={styles.tripFactLabel}>
                  STAY
                </Text>

                <Text style={styles.tripFactValue}>
                  {journey?.accommodation ||
                    'To be confirmed'}
                </Text>
              </View>

              <View style={styles.tripFact}>
                <Text style={styles.tripFactLabel}>
                  VEHICLE
                </Text>

                <Text style={styles.tripFactValue}>
                  {journey?.vehicle ||
                    'To be confirmed'}
                </Text>
              </View>

              <View style={styles.tripFact}>
                <Text style={styles.tripFactLabel}>
                  AIRPORT
                </Text>

                <Text style={styles.tripFactValue}>
                  {journey?.arrival?.airport ||
                    'To be confirmed'}
                </Text>
              </View>
            </View>
          </View>

          {viewMode === 'day' &&
            itinerary.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={
                  styles.daySelector
                }
              >
                {itinerary.map((item, index) => {
                  const active =
                    selectedDay === item.day;
                  const [weekday, date] =
                    item.day.split(' ');

                  return (
                    <Pressable
                      key={`${item.day}-${index}`}
                      onPress={() =>
                        setSelectedDay(item.day)
                      }
                      style={[
                        styles.dayButton,
                        active &&
                          styles.dayButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayButtonWeekday,
                          active &&
                            styles.dayButtonTextActive,
                        ]}
                      >
                        {weekday}
                      </Text>

                      <Text
                        style={[
                          styles.dayButtonDate,
                          active &&
                            styles.dayButtonTextActive,
                        ]}
                      >
                        {date}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}

          {itinerary.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>
                Your itinerary is being prepared.
              </Text>

              <Text style={styles.emptyStateText}>
                Your confirmed itinerary details
                will appear here once they are
                available.
              </Text>
            </View>
          ) : viewMode === 'full' ? (
            <View style={styles.trip}>
              {itinerary.map((item, index) => {
                const [weekday, date] =
                  item.day.split(' ');

                return (
                  <View
                    key={`${item.day}-${index}`}
                    style={styles.daySection}
                  >
                    <View style={styles.dayHeading}>
                      <View style={styles.dateBox}>
                        <Text style={styles.dateDay}>
                          {weekday}
                        </Text>

                        <Text style={styles.dateNum}>
                          {date}
                        </Text>
                      </View>

                      <View
                        style={styles.dayHeadingCopy}
                      >
                        <Text style={styles.dayLabel}>
                          DAY {index + 1}
                        </Text>

                        <Text style={styles.dayTitle}>
                          {item.title || 'Your Day'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.timeline}>
                      <View style={styles.timelineItem}>
                        <View
                          style={styles.timelineRail}
                        >
                          <View
                            style={styles.timelineDot}
                          />
                        </View>

                        <View
                          style={styles.eventCard}
                        >
                          <View
                            style={styles.eventHeader}
                          >
                            <Text
                              style={styles.eventTag}
                            >
                              {item.tag ||
                                'Experience'}
                            </Text>

                            <Text
                              style={styles.eventTime}
                            >
                              {item.time ||
                                'At your pace'}
                            </Text>
                          </View>

                          <Text
                            style={styles.eventTitle}
                          >
                            {item.title ||
                              'Your Day'}
                          </Text>

                          {!!item.place && (
                            <Text
                              style={styles.eventPlace}
                            >
                              {item.place}
                            </Text>
                          )}

                          {!!item.detail && (
                            <Text
                              style={styles.eventDetail}
                            >
                              {item.detail}
                            </Text>
                          )}

                          {item.attractions?.length >
                            0 && (
                            <View
                              style={styles.attractions}
                            >
                              <Text
                                style={
                                  styles.attractionsLabel
                                }
                              >
                                ATTRACTIONS
                              </Text>

                              {item.attractions.map(
                                (
                                  attraction,
                                  attractionIndex,
                                ) => (
                                  <View
                                    key={
                                      attraction.id
                                    }
                                    style={
                                      styles.attractionItem
                                    }
                                  >
                                    <View
                                      style={
                                        styles.attractionNumber
                                      }
                                    >
                                      <Text
                                        style={
                                          styles.attractionNumberText
                                        }
                                      >
                                        {attractionIndex +
                                          1}
                                      </Text>
                                    </View>

                                    <View
                                      style={
                                        styles.attractionCopy
                                      }
                                    >
                                      <Text
                                        style={
                                          styles.attractionName
                                        }
                                      >
                                        {
                                          attraction.name
                                        }
                                      </Text>

                                      {(
                                        attraction.arrivalTime ||
                                        attraction.departureTime
                                      ) && (
                                        <Text
                                          style={
                                            styles.attractionTime
                                          }
                                        >
                                          {attraction.arrivalTime ??
                                            'TBC'}

                                          {attraction.departureTime
                                            ? ` – ${attraction.departureTime}`
                                            : ''}
                                        </Text>
                                      )}

                                      {!!attraction.guestExperienceNotes && (
                                        <Text
                                          style={
                                            styles.attractionDescription
                                          }
                                        >
                                          {
                                            attraction.guestExperienceNotes
                                          }
                                        </Text>
                                      )}

                                      {!!attraction.mealNotes && (
                                        <Text
                                          style={
                                            styles.attractionDescription
                                          }
                                        >
                                          Dining:{' '}
                                          {
                                            attraction.mealNotes
                                          }
                                        </Text>
                                      )}

                                      {attraction.ticketsRequired ===
                                        'Yes' && (
                                        <Text
                                          style={
                                            styles.attractionMeta
                                          }
                                        >
                                          Tickets:{' '}
                                          {attraction.ticketsConfirmed ||
                                            'Pending'}
                                        </Text>
                                      )}

                                      {attraction.vipRequired ===
                                        'Yes' && (
                                        <Text
                                          style={
                                            styles.attractionMeta
                                          }
                                        >
                                          VIP / Fast-Track:{' '}
                                          {attraction.vipConfirmed ||
                                            'Pending'}
                                        </Text>
                                      )}
                                    </View>
                                  </View>
                                ),
                              )}
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : selectedItineraryDay ? (
            <View style={styles.daySection}>
              <View style={styles.dayHeading}>
                <View style={styles.dateBox}>
                  <Text style={styles.dateDay}>
                    {
                      selectedItineraryDay.day.split(
                        ' ',
                      )[0]
                    }
                  </Text>

                  <Text style={styles.dateNum}>
                    {
                      selectedItineraryDay.day.split(
                        ' ',
                      )[1]
                    }
                  </Text>
                </View>

                <View style={styles.dayHeadingCopy}>
                  <Text style={styles.dayLabel}>
                    DAY{' '}
                    {itinerary.findIndex(
                      (item) =>
                        item.day ===
                        selectedItineraryDay.day,
                    ) + 1}
                  </Text>

                  <Text style={styles.dayTitle}>
                    {selectedItineraryDay.title ||
                      'Your Day'}
                  </Text>
                </View>
              </View>

              <View style={styles.timeline}>
                <View style={styles.timelineItem}>
                  <View style={styles.timelineRail}>
                    <View
                      style={styles.timelineDot}
                    />
                  </View>

                  <View style={styles.eventCard}>
                    <View style={styles.eventHeader}>
                      <Text style={styles.eventTag}>
                        {selectedItineraryDay.tag ||
                          'Experience'}
                      </Text>

                      <Text style={styles.eventTime}>
                        {selectedItineraryDay.time ||
                          'At your pace'}
                      </Text>
                    </View>

                    <Text style={styles.eventTitle}>
                      {selectedItineraryDay.title ||
                        'Your Day'}
                    </Text>

                    {!!selectedItineraryDay.place && (
                      <Text style={styles.eventPlace}>
                        {selectedItineraryDay.place}
                      </Text>
                    )}

                    {!!selectedItineraryDay.detail && (
                      <Text style={styles.eventDetail}>
                        {selectedItineraryDay.detail}
                      </Text>
                    )}

                    {selectedItineraryDay.attractions
                      ?.length > 0 && (
                      <View
                        style={styles.attractions}
                      >
                        <Text
                          style={
                            styles.attractionsLabel
                          }
                        >
                          ATTRACTIONS
                        </Text>

                        {selectedItineraryDay.attractions.map(
                          (
                            attraction,
                            attractionIndex,
                          ) => (
                            <View
                              key={attraction.id}
                              style={
                                styles.attractionItem
                              }
                            >
                              <View
                                style={
                                  styles.attractionNumber
                                }
                              >
                                <Text
                                  style={
                                    styles.attractionNumberText
                                  }
                                >
                                  {attractionIndex + 1}
                                </Text>
                              </View>

                              <View
                                style={
                                  styles.attractionCopy
                                }
                              >
                                <Text
                                  style={
                                    styles.attractionName
                                  }
                                >
                                  {attraction.name}
                                </Text>

                                {(
                                  attraction.arrivalTime ||
                                  attraction.departureTime
                                ) && (
                                  <Text
                                    style={
                                      styles.attractionTime
                                    }
                                  >
                                    {attraction.arrivalTime ??
                                      'TBC'}

                                    {attraction.departureTime
                                      ? ` – ${attraction.departureTime}`
                                      : ''}
                                  </Text>
                                )}

                                {!!attraction.guestExperienceNotes && (
                                  <Text
                                    style={
                                      styles.attractionDescription
                                    }
                                  >
                                    {
                                      attraction.guestExperienceNotes
                                    }
                                  </Text>
                                )}

                                {!!attraction.mealNotes && (
                                  <Text
                                    style={
                                      styles.attractionDescription
                                    }
                                  >
                                    Dining:{' '}
                                    {
                                      attraction.mealNotes
                                    }
                                  </Text>
                                )}

                                {attraction.ticketsRequired ===
                                  'Yes' && (
                                  <Text
                                    style={
                                      styles.attractionMeta
                                    }
                                  >
                                    Tickets:{' '}
                                    {attraction.ticketsConfirmed ||
                                      'Pending'}
                                  </Text>
                                )}

                                {attraction.vipRequired ===
                                  'Yes' && (
                                  <Text
                                    style={
                                      styles.attractionMeta
                                    }
                                  >
                                    VIP / Fast-Track:{' '}
                                    {attraction.vipConfirmed ||
                                      'Pending'}
                                  </Text>
                                )}
                              </View>
                            </View>
                          ),
                        )}
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
          ) : null}

          <View style={styles.note}>
            <Text style={styles.noteIcon}>✦</Text>

            <View style={styles.noteCopy}>
              <EyebrowText>
                GUEST EXPERIENCE NOTE
              </EyebrowText>

              <Text style={styles.noteText}>
                Additional guest experience notes
                will appear here when confirmed.
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
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

  content: {
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom:
      Layout.bottomNavHeight + Spacing.five,
    gap: Spacing.four,
  },

  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },

  loadingText: {
    fontSize: 12,
    color: Palette.muted,
    textAlign: 'center',
  },

  errorText: {
    fontSize: 12,
    lineHeight: 18,
    color: Palette.muted,
    textAlign: 'center',
  },

  head: {
    gap: 10,
  },

  accent: {
    fontFamily: Fonts.serif,
    fontStyle: 'italic',
    color: Palette.greenLight,
  },

  subtitle: {
    color: Palette.muted,
    fontSize: 14,
    lineHeight: 21,
  },

  viewSwitcher: {
    flexDirection: 'row',
    backgroundColor: Palette.paper,
    borderWidth: 1,
    borderColor: Palette.line,
    borderRadius: 8,
    padding: 4,
  },

  viewSwitcherButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 6,
  },

  viewSwitcherButtonActive: {
    backgroundColor: Palette.green,
  },

  viewSwitcherText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    color: Palette.muted,
  },

  viewSwitcherTextActive: {
    color: Palette.cream,
  },

  daySelector: {
    gap: 8,
    paddingRight: 18,
  },

  dayButton: {
    width: 58,
    height: 58,
    borderWidth: 1,
    borderColor: Palette.line,
    borderRadius: 8,
    backgroundColor: Palette.white,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },

  dayButtonActive: {
    backgroundColor: Palette.green,
    borderColor: Palette.green,
  },

  dayButtonWeekday: {
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1,
    color: Palette.muted,
    textTransform: 'uppercase',
  },

  dayButtonDate: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    color: Palette.ink,
  },

  dayButtonTextActive: {
    color: Palette.cream,
  },

  trip: {
    gap: Spacing.four,
  },

  daySection: {
    gap: 16,
  },

  dayHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  dayHeadingCopy: {
    flex: 1,
    gap: 3,
  },

  dayLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.1,
    color: Palette.green,
  },

  dayTitle: {
    fontFamily: Fonts.serif,
    fontSize: 20,
    color: Palette.ink,
  },

  dateBox: {
    width: 47,
    height: 51,
    borderWidth: 1,
    borderColor: Palette.line,
    backgroundColor: Palette.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dateDay: {
    fontSize: 7,
    letterSpacing: 1,
    color: Palette.muted,
    fontWeight: '700',
  },

  dateNum: {
    fontSize: 19,
    fontWeight: '700',
    color: Palette.ink,
  },

  timeline: {
    gap: 0,
  },

  timelineItem: {
    flexDirection: 'row',
    gap: 12,
  },

  timelineRail: {
    width: 22,
    alignItems: 'center',
  },

  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.gold,
    marginTop: 20,
  },

  eventCard: {
    flex: 1,
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.line,
    padding: 12,
    gap: 6,
    marginBottom: 14,
  },

  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },

  eventTag: {
    flex: 1,
    fontSize: 8,
    letterSpacing: 1,
    color: Palette.green,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  eventTime: {
    fontSize: 8,
    color: Palette.muted,
  },

  eventTitle: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    color: Palette.ink,
  },

  eventPlace: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.ink,
  },

  eventDetail: {
    fontSize: 11,
    color: Palette.muted,
    lineHeight: 16,
  },

  note: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.line,
    padding: 18,
  },

  noteIcon: {
    fontSize: 18,
    color: Palette.gold,
  },

  noteCopy: {
    flex: 1,
    gap: 8,
  },

  noteText: {
    fontSize: 12,
    lineHeight: 18,
    color: Palette.muted,
  },

  attractions: {
    marginTop: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Palette.line,
    gap: 10,
  },

  attractionsLabel: {
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: Palette.green,
  },

  attractionItem: {
    flexDirection: 'row',
    gap: 10,
  },

  attractionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Palette.paper,
    borderWidth: 1,
    borderColor: Palette.line,
    alignItems: 'center',
    justifyContent: 'center',
  },

  attractionNumberText: {
    fontSize: 9,
    fontWeight: '800',
    color: Palette.green,
  },

  attractionCopy: {
    flex: 1,
    gap: 3,
  },

  attractionName: {
    fontFamily: Fonts.serif,
    fontSize: 15,
    color: Palette.ink,
  },

  attractionTime: {
    fontSize: 9,
    fontWeight: '700',
    color: Palette.ink,
  },

  attractionDescription: {
    fontSize: 10,
    lineHeight: 15,
    color: Palette.muted,
  },

  attractionMeta: {
    fontSize: 9,
    lineHeight: 14,
    color: Palette.green,
    fontWeight: '700',
  },

  tripOverview: {
    backgroundColor: Palette.green,
    borderRadius: 10,
    padding: 18,
    gap: 14,
  },

  tripOverviewTitle: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.55)',
  },

  guestName: {
    width: '100%',
    fontFamily: Fonts.serif,
    fontSize: 22,
    lineHeight: 28,
    color: Palette.cream,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor:
      'rgba(255,255,255,0.15)',
  },

  tripDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 18,
  },

  tripFact: {
    width: '50%',
    paddingRight: 12,
    gap: 5,
  },

  tripFactLabel: {
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: 'rgba(255,255,255,0.5)',
  },

  tripFactValue: {
    fontFamily: Fonts.serif,
    fontSize: 14,
    lineHeight: 19,
    color: Palette.cream,
  },

  emptyState: {
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.line,
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },

  emptyStateTitle: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    color: Palette.ink,
    textAlign: 'center',
  },

  emptyStateText: {
    fontSize: 12,
    lineHeight: 18,
    color: Palette.muted,
    textAlign: 'center',
  },
});