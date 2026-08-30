import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { SummaryCard } from '@/components/ui/summary-card';
import { EyebrowText, SerifTitle } from '@/components/ui/typography';
import { Fonts, Layout, Palette, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useJourney } from '@/context/journey-context';
import { useGreeting } from '@/hooks/use-journey-state';

export default function HomeScreen() {
  const router = useRouter();
  const greeting = useGreeting();
  const { firstName, fullName } = useAuth();
  const { updates, avatarUri, markRead, pickAvatar } = useJourney();

  return (
    <View style={styles.screen}>
      <AppHeader
        updates={updates}
        avatarUri={avatarUri}
        onAvatarPress={pickAvatar}
        onNotificationPress={(id) => {
          markRead(id);
          router.push('/(client)/updates');
        }}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <View style={styles.introCopy}>
            <EyebrowText>{fullName.toUpperCase()} · GOLD EXPERIENCE</EyebrowText>
            <SerifTitle size="page" style={styles.greeting}>
              {greeting},{'\n'}
              <Text style={styles.greetingName}>{firstName}.</Text>
            </SerifTitle>
            <Text style={styles.introSubtitle}>Your private Jamaican journey is ready.</Text>
          </View>
        </View>

        <LinearGradient
          colors={['#0C3829', '#1B4B38']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}>
          <View style={styles.heroTop}>
            <Text style={styles.heroLabel}>YOUR JOURNEY</Text>
            <Text style={styles.heroLabel}>5 DAYS · 4 GUESTS</Text>
          </View>
          <View>
            <Text style={styles.heroDate}>SEP 12—16, 2026</Text>
            <Text style={styles.heroTitle}>
              Montego Bay{'\n'}
              <Text style={styles.heroTitleAccent}>in your own time.</Text>
            </Text>
          </View>
          <Text
            accessibilityRole="button"
            onPress={() => router.push('/(client)/itinerary')}
            style={styles.heroLink}>
            View itinerary →
          </Text>
        </LinearGradient>

        <View style={styles.sectionHead}>
          <View>
            <EyebrowText>AT A GLANCE</EyebrowText>
            <SerifTitle size="section">Your experience</SerifTitle>
          </View>
          <Text style={styles.confirmed}>CONFIRMED</Text>
        </View>

        <View style={styles.summaryGrid}>
          <SummaryCard style={styles.summaryCard} icon="▥" label="Accommodation" value="Half Moon" sub="Montego Bay" />
          <SummaryCard
            style={styles.summaryCard}
            icon="▰"
            label="Private Vehicle"
            value="AMG GLS 63"
            sub="Dedicated throughout"
          />
          <SummaryCard
            style={styles.summaryCard}
            icon="●"
            label="Your CEA"
            value="Alicia Brown"
            sub="Client Experience Architect"
          />
          <SummaryCard
            style={styles.summaryCard}
            icon="✥"
            label="Experience Host"
            value="Andre Williams"
            sub="Your dedicated host"
          />
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusIcon}>
            <Text style={styles.statusIconText}>✓</Text>
          </View>
          <View style={styles.statusCopy}>
            <EyebrowText>JOURNEY STATUS</EyebrowText>
            <Text style={styles.statusTitle}>Your itinerary is finalized</Text>
            <Text style={styles.statusBody}>
              Add-ons may be requested for CEA review. We'll let you know when payment becomes
              available.
            </Text>
          </View>
          <Text
            accessibilityRole="button"
            onPress={() => router.push('/(client)/addons')}
            style={styles.statusAction}>
            Explore Add-Ons
          </Text>
        </View>

        <View style={styles.serviceRow}>
          <View style={styles.serviceItem}>
            <Text style={styles.serviceLabel}>ARRIVAL</Text>
            <Text style={styles.serviceValue}>MBJ · 2:35 p.m.</Text>
          </View>
          <View style={styles.serviceDivider} />
          <View style={styles.serviceItem}>
            <Text style={styles.serviceLabel}>PRIVATE SERVICE</Text>
            <Text style={styles.serviceValue}>Priority Arrival Access</Text>
          </View>
          <View style={styles.serviceDivider} />
          <View style={styles.serviceItem}>
            <Text style={styles.serviceLabel}>DEPARTURE</Text>
            <Text style={styles.serviceValue}>MBJ · 10:15 a.m.</Text>
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
