import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandHeader } from '@/components/brand-header';
import { AppButton } from '@/components/ui/app-button';
import { EyebrowText, SerifTitle } from '@/components/ui/typography';
import { JAMAICA_DESTINATIONS } from '@/constants/mock-data';
import { getPlatformHomeRoute } from '@/constants/platforms';
import { Fonts, Palette, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';

export default function LandingScreen() {
  const router = useRouter();

  const {
    isAuthenticated,
    isBootstrapping,
    hasCompletedWelcome,
    role,
  } = useAuth();

  useEffect(() => {
    if (isBootstrapping || !isAuthenticated) {
      return;
    }

    if (!hasCompletedWelcome) {
      router.replace('/welcome');
      return;
    }

    if (!role) {
      return;
    }

    router.replace(getPlatformHomeRoute(role));
  }, [
    isAuthenticated,
    isBootstrapping,
    hasCompletedWelcome,
    role,
    router,
  ]);

  return (
    <LinearGradient
      colors={['#174A39', '#08291F']}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <BrandHeader light style={styles.brand} />

        <View style={styles.content}>
          <EyebrowText light>
            YOUR JOURNEY, CONSIDERED
          </EyebrowText>

          <SerifTitle size="hero" style={styles.title}>
            Jamaica,{'\n'}
            <Text style={styles.titleAccent}>
              privately yours.
            </Text>
          </SerifTitle>

          <Text style={styles.copy}>
            One private app for every part of your Tour Jamaica
            experience—from arrival to the final drive.
          </Text>

          <AppButton
            label="Log In"
            variant="landing"
            onPress={() => router.push('/login')}
            accessibilityHint="Opens the private access login screen"
          />
        </View>

        <View style={styles.footer}>
          {JAMAICA_DESTINATIONS.map((destination, index) => (
            <View key={destination} style={styles.footerItem}>
              {index > 0 && <View style={styles.goldLine} />}

              <Text style={styles.footerText}>
                {destination}
              </Text>
            </View>
          ))}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    paddingHorizontal: 26,
    paddingVertical: 20,
  },

  brand: {
    marginBottom: 'auto',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: Spacing.five,
  },

  title: {
    marginTop: 13,
    marginBottom: 30,
  },

  titleAccent: {
    fontFamily: Fonts.serif,
    color: Palette.goldLight,
    fontStyle: 'italic',
  },

  copy: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    lineHeight: 28,
    color: Palette.storyText,
    maxWidth: 460,
    marginBottom: Spacing.two,
  },

  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
    marginTop: 'auto',
  },

  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  footerText: {
    fontSize: 8,
    letterSpacing: 2,
    color: Palette.storyFooter,
    fontWeight: '600',
  },

  goldLine: {
    width: 30,
    height: 1,
    backgroundColor: Palette.gold,
  },
});