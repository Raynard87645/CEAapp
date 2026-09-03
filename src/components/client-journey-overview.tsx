import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { SummaryCard } from '@/components/ui/summary-card';
import { EyebrowText, SerifTitle } from '@/components/ui/typography';
import { Fonts, Layout, Palette, Spacing } from '@/constants/theme';
import type { JourneySummary } from '@/services/api/types';
import { useGreeting } from '@/hooks/use-journey-state';

type ClientJourneyOverviewProps = {
  journey: JourneySummary;
  contentStyle?: ViewStyle;
  showGreeting?: boolean;
  onViewItinerary?: () => void;
  onExploreAddOns?: () => void;
};

export function ClientJourneyOverview({
  journey,
  contentStyle,
  showGreeting = true,
  onViewItinerary,
  onExploreAddOns,
}: ClientJourneyOverviewProps) {
  const greeting = useGreeting();
  const isFinalized = journey.journeyStatus === 'finalized';
  const durationLabel =
    journey.durationDays > 0
      ? `${journey.durationDays} ${journey.durationDays === 1 ? 'DAY' : 'DAYS'}`
      : 'JOURNEY';
  const guestLabel = `${journey.guestCount} ${journey.guestCount === 1 ? 'GUEST' : 'GUESTS'}`;

  return (
    <ScrollView
      contentContainerStyle={[styles.content, contentStyle]}
      showsVerticalScrollIndicator={false}>
      {showGreeting ? (
        <View style={styles.intro}>
          <View style={styles.introCopy}>
            <EyebrowText>
              {journey.fullName.toUpperCase()} · {journey.experienceLevel.toUpperCase()}
            </EyebrowText>
            <SerifTitle size="page" style={styles.greeting}>
              {greeting},{'\n'}
              <Text style={styles.greetingName}>{journey.firstName}.</Text>
            </SerifTitle>
            <Text style={styles.introSubtitle}>Your private Jamaican journey is ready.</Text>
          </View>
        </View>
      ) : null}

      <LinearGradient
        colors={['#0C3829', '#1B4B38']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}>
        <View style={styles.heroTop}>
          <Text style={styles.heroLabel}>YOUR JOURNEY</Text>
          <Text style={styles.heroLabel}>
            {durationLabel} · {guestLabel}
          </Text>
        </View>
        <View>
          <Text style={styles.heroDate}>{journey.travelDates.toUpperCase()}</Text>
          <Text style={styles.heroTitle}>
            {journey.destination}
            {'\n'}
            <Text style={styles.heroTitleAccent}>in your own time.</Text>
          </Text>
        </View>
        {onViewItinerary ? (
          <Text accessibilityRole="button" onPress={onViewItinerary} style={styles.heroLink}>
            View itinerary →
          </Text>
        ) : null}
      </LinearGradient>

      <View style={styles.sectionHead}>
        <View>
          <EyebrowText>AT A GLANCE</EyebrowText>
          <SerifTitle size="section">Your experience</SerifTitle>
        </View>
        <Text style={styles.confirmed}>{isFinalized ? 'CONFIRMED' : 'PREPARING'}</Text>
      </View>

      <View style={styles.summaryGrid}>
        <SummaryCard
          style={styles.summaryCard}
          icon="▥"
          label="Accommodation"
          value={journey.accommodation}
          sub={journey.destination}
        />
        <SummaryCard
          style={styles.summaryCard}
          icon="▰"
          label="Private Vehicle"
          value={journey.vehicle}
          sub="Dedicated throughout"
        />
        <SummaryCard
          style={styles.summaryCard}
          icon="●"
          label="Your CEA"
          value={journey.ceaName}
          sub="Client Experience Architect"
        />
        <SummaryCard
          style={styles.summaryCard}
          icon="✥"
          label="Experience Host"
          value={journey.hostName}
          sub="Your dedicated host"
        />
      </View>

      <View style={styles.statusCard}>
        <View style={styles.statusIcon}>
          <Text style={styles.statusIconText}>{isFinalized ? '✓' : '◷'}</Text>
        </View>
        <View style={styles.statusCopy}>
          <EyebrowText>JOURNEY STATUS</EyebrowText>
          <Text style={styles.statusTitle}>
            {isFinalized ? 'Your itinerary is finalized' : 'Your itinerary is being prepared'}
          </Text>
          <Text style={styles.statusBody}>
            {isFinalized
              ? "Add-ons may be requested for CEA review. We'll let you know when payment becomes available."
              : 'Your Client Experience Architect is preparing the final journey details.'}
          </Text>
        </View>
        {onExploreAddOns ? (
          <Text accessibilityRole="button" onPress={onExploreAddOns} style={styles.statusAction}>
            Explore Add-Ons
          </Text>
        ) : null}
      </View>

      <View style={styles.serviceRow}>
        <View style={styles.serviceItem}>
          <Text style={styles.serviceLabel}>ARRIVAL</Text>
          <Text style={styles.serviceValue}>
            {journey.arrival.airport} · {journey.arrival.time}
          </Text>
        </View>
        <View style={styles.serviceDivider} />
        <View style={styles.serviceItem}>
          <Text style={styles.serviceLabel}>PRIVATE SERVICE</Text>
          <Text style={styles.serviceValue}>Priority Arrival Access</Text>
        </View>
        <View style={styles.serviceDivider} />
        <View style={styles.serviceItem}>
          <Text style={styles.serviceLabel}>DEPARTURE</Text>
          <Text style={styles.serviceValue}>
            {journey.departure.airport} · {journey.departure.time}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: Layout.bottomNavHeight + Spacing.five,
    gap: Spacing.four,
  },
  intro: {
    gap: Spacing.three,
  },
  introCopy: {
    gap: 8,
  },
  greeting: {
    marginTop: 4,
  },
  greetingName: {
    color: Palette.greenLight,
    fontFamily: Fonts.serif,
  },
  introSubtitle: {
    color: Palette.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  hero: {
    borderRadius: 12,
    padding: 23,
    minHeight: 260,
    justifyContent: 'space-between',
    marginTop: Spacing.two,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroLabel: {
    fontSize: 8,
    letterSpacing: 1.6,
    color: '#B9C7BE',
    fontWeight: '700',
  },
  heroDate: {
    fontSize: 10,
    letterSpacing: 1.2,
    color: '#B9C7BE',
    marginBottom: 8,
  },
  heroTitle: {
    fontFamily: Fonts.serif,
    fontSize: 31,
    lineHeight: 34,
    color: Palette.white,
  },
  heroTitleAccent: {
    fontFamily: Fonts.serif,
    fontStyle: 'italic',
    textAlign: 'right',
    color: Palette.goldLight,
  },
  heroLink: {
    color: Palette.white,
    fontSize: 10,
    fontWeight: '700',
    marginTop: Spacing.three,
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: Spacing.two,
  },
  confirmed: {
    fontSize: 8,
    letterSpacing: 1.5,
    color: Palette.green,
    fontWeight: '800',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  summaryCard: {
    width: '48%',
    flexGrow: 1,
    minWidth: '46%',
  },
  statusCard: {
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.line,
    borderRadius: 8,
    padding: 18,
    gap: 12,
  },
  statusIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Palette.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIconText: {
    color: Palette.green,
    fontWeight: '700',
  },
  statusCopy: {
    gap: 6,
  },
  statusTitle: {
    fontFamily: Fonts.serif,
    fontSize: 20,
    color: Palette.ink,
  },
  statusBody: {
    color: Palette.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  statusAction: {
    color: Palette.green,
    fontSize: 10,
    fontWeight: '700',
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.line,
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  serviceItem: {
    flex: 1,
    gap: 4,
  },
  serviceLabel: {
    fontSize: 7,
    letterSpacing: 1.2,
    color: Palette.muted,
    fontWeight: '700',
  },
  serviceValue: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.ink,
  },
  serviceDivider: {
    width: 1,
    height: 28,
    backgroundColor: Palette.line,
  },
});
