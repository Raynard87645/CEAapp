import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { EyebrowText, SerifTitle } from '@/components/ui/typography';
import { ITINERARY } from '@/constants/mock-data';
import { Fonts, Layout, Palette, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useJourney } from '@/context/journey-context';

export default function ItineraryScreen() {
  const { fullName } = useAuth();
  const { updates, avatarUri, markRead, pickAvatar } = useJourney();

  return (
    <View style={styles.screen}>
      <AppHeader updates={updates} avatarUri={avatarUri} onAvatarPress={pickAvatar} onNotificationPress={markRead} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.head}>
          <EyebrowText>YOUR PRIVATE ITINERARY</EyebrowText>
          <SerifTitle size="page">
            Five days,{'\n'}
            <Text style={styles.accent}>considered.</Text>
          </SerifTitle>
          <Text style={styles.subtitle}>
            A curated journey for {fullName}. Every movement is coordinated by your Tour Jamaica
            team.
          </Text>
        </View>

        <View style={styles.overview}>
          <View style={styles.overviewFact}>
            <Text style={styles.overviewLabel}>DATES</Text>
            <Text style={styles.overviewValue}>Sep 12—16</Text>
          </View>
          <View style={styles.overviewFact}>
            <Text style={styles.overviewLabel}>GUESTS</Text>
            <Text style={styles.overviewValue}>4</Text>
          </View>
          <View style={styles.overviewFact}>
            <Text style={styles.overviewLabel}>BASE</Text>
            <Text style={styles.overviewValue}>Half Moon</Text>
          </View>
        </View>

        <View style={styles.timeline}>
          {ITINERARY.map((event, index) => (
            <View key={event.title} style={styles.timelineItem}>
              <View style={styles.dateBox}>
                <Text style={styles.dateDay}>{event.day.split(' ')[0]}</Text>
                <Text style={styles.dateNum}>{event.day.split(' ')[1]}</Text>
              </View>

              <View style={styles.timelineRail}>
                <View style={styles.timelineDot} />
                {index < ITINERARY.length - 1 && <View style={styles.timelineLine} />}
              </View>

              <View style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTag}>{event.tag}</Text>
                  <Text style={styles.eventTime}>{event.time}</Text>
                </View>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventPlace}>{event.place}</Text>
                <Text style={styles.eventDetail}>{event.detail}</Text>

                {event.title === 'Arrival Day' && (
                  <View style={styles.chips}>
                    <Text style={styles.chip}>Priority Arrival Access</Text>
                    <Text style={styles.chip}>Lounge Access · Separate service</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.note}>
          <Text style={styles.noteIcon}>✦</Text>
          <View style={styles.noteCopy}>
            <EyebrowText>GUEST EXPERIENCE NOTE</EyebrowText>
            <Text style={styles.noteText}>
              Comfortable resort wear is perfect throughout. For your South Coast day, bring swimwear
              and shoes suitable for light walking.
            </Text>
          </View>
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
  content: {
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: Layout.bottomNavHeight + Spacing.five,
    gap: Spacing.four,
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
  overview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.line,
    borderRadius: 8,
    padding: 18,
  },
  overviewFact: {
    gap: 4,
  },
  overviewLabel: {
    fontSize: 7,
    letterSpacing: 1.2,
    color: Palette.muted,
    fontWeight: '700',
  },
  overviewValue: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    color: Palette.ink,
  },
  timeline: {
    gap: 0,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
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
  timelineLine: {
    flex: 1,
    width: 1,
    backgroundColor: Palette.line,
    marginTop: 4,
  },
  eventCard: {
    flex: 1,
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.line,
    padding: 12,
    gap: 6,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTag: {
    fontSize: 8,
    letterSpacing: 1,
    color: Palette.green,
    fontWeight: '700',
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
  chips: {
    gap: 6,
    marginTop: 4,
  },
  chip: {
    alignSelf: 'flex-start',
    fontSize: 8,
    color: Palette.green,
    backgroundColor: '#EEF3EA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    overflow: 'hidden',
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
});
