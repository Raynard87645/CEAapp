import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandHeader } from '@/components/brand-header';
import { SummaryCard } from '@/components/ui/summary-card';
import { EyebrowText, SerifTitle } from '@/components/ui/typography';
import { Layout, Palette, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useGreeting } from '@/hooks/use-journey-state';

export default function HostScreen() {
  const router = useRouter();
  const greeting = useGreeting();
  const { isAuthenticated, hasCompletedWelcome, role, firstName, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/');
      return;
    }
    if (!hasCompletedWelcome) {
      router.replace('/welcome');
      return;
    }
    if (role !== 'host') {
      router.replace('/(client)');
    }
  }, [isAuthenticated, hasCompletedWelcome, role, router]);

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.header}>
          <BrandHeader compact />
          <View style={styles.hostAvatar}>
            <Text style={styles.hostAvatarText}>AW</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <EyebrowText>EXPERIENCE HOST ENVIRONMENT</EyebrowText>
        <SerifTitle size="page">
          {greeting},{'\n'}
          <Text style={styles.nameAccent}>{firstName}.</Text>
        </SerifTitle>
        <Text style={styles.subtitle}>Your assigned movements are ready.</Text>

        <LinearGradient colors={['#0C3829', '#1B4B38']} style={styles.hero}>
          <Text style={styles.heroLabel}>TODAY'S PRIORITY</Text>
          <Text style={styles.heroTitle}>{firstName} Arrival</Text>
          <Text style={styles.heroDetail}>MBJ · 2:35 p.m. · AMG GLS 63</Text>
          <Text style={styles.heroAction}>Open assigned movement →</Text>
        </LinearGradient>

        <View style={styles.grid}>
          <SummaryCard style={styles.gridCard} icon="◷" label="Next movement" value="Airport pickup" sub="Arrival Hall · Door 3" />
          <SummaryCard style={styles.gridCard} icon="▰" label="Assigned vehicle" value="AMG GLS 63" sub="Prepared · Bay 06" />
          <SummaryCard style={styles.gridCard} icon="●" label="Guest party" value="4 guests" sub="Gold Experience" />
          <SummaryCard style={styles.gridCard} icon="✓" label="Readiness" value="Confirmed" sub="All checks complete" />
        </View>

        <Text style={styles.note}>
          Experience Host interface preserved within the shared Tour Jamaica app shell.
        </Text>

        <Pressable accessibilityRole="button" onPress={() => { logout(); router.replace('/'); }} style={styles.logout}>
          <Text style={styles.logoutText}>Exit prototype</Text>
        </Pressable>
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
  headerSafe: {
    backgroundColor: Palette.paper,
    borderBottomWidth: 1,
    borderBottomColor: Palette.line,
  },
  header: {
    height: Layout.headerHeight,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hostAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Palette.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hostAvatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.green,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: Spacing.six,
    gap: Spacing.four,
  },
  nameAccent: {
    color: Palette.greenLight,
  },
  subtitle: {
    color: Palette.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  hero: {
    padding: 35,
    gap: 8,
    marginTop: Spacing.two,
  },
  heroLabel: {
    fontSize: 8,
    letterSpacing: 1.6,
    color: Palette.gold,
    fontWeight: '700',
  },
  heroTitle: {
    fontFamily: 'Georgia',
    fontSize: 34,
    color: Palette.white,
  },
  heroDetail: {
    color: '#BBC9C1',
    fontSize: 13,
  },
  heroAction: {
    color: Palette.white,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridCard: {
    width: '48%',
    flexGrow: 1,
    minWidth: '46%',
  },
  note: {
    textAlign: 'center',
    color: Palette.muted,
    fontSize: 9,
    marginTop: Spacing.three,
  },
  logout: {
    alignSelf: 'center',
    paddingVertical: 12,
  },
  logoutText: {
    color: Palette.green,
    fontSize: 10,
    fontWeight: '700',
  },
});
