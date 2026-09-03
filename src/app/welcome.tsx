import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandHeader } from '@/components/brand-header';
import { EyebrowText, SerifTitle } from '@/components/ui/typography';
import { getPlatformConfig, getPlatformHomeRoute } from '@/constants/platforms';
import { Palette, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';

export default function WelcomeScreen() {
  const router = useRouter();
  const { role, firstName, platformLabel, completeWelcome, isAuthenticated, isBootstrapping } =
    useAuth();
  const progress = useRef(new Animated.Value(0)).current;
  const platform = getPlatformConfig(role);

  useEffect(() => {
    if (isBootstrapping) return;

    if (!isAuthenticated || !role) {
      router.replace('/');
      return;
    }

    Animated.timing(progress, {
      toValue: 1,
      duration: 4800,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      completeWelcome();
      router.replace(getPlatformHomeRoute(role));
    }, 5000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isBootstrapping, role, router, completeWelcome, progress]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const subtitle = platform?.welcomeMessage ?? 'Your workspace is now ready.';
  const subtitleDetail = platform?.welcomeDetail;

  return (
    <LinearGradient colors={['#123F30', '#08291F']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <BrandHeader light />

        <View style={styles.center}>
          <View style={styles.seal}>
            <Text style={styles.sealText}>{firstName.charAt(0).toUpperCase()}</Text>
          </View>

          <EyebrowText light style={styles.eyebrow}>
            {platform?.eyebrow ?? platformLabel.toUpperCase()}
          </EyebrowText>
          <SerifTitle size="page" style={styles.title}>
            Welcome, {firstName}
          </SerifTitle>
          <Text style={styles.subtitle}>{subtitle}</Text>
          {subtitleDetail ? <Text style={styles.subtitleDetail}>{subtitleDetail}</Text> : null}

          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width }]} />
          </View>

          <Text style={styles.caption}>PREPARING YOUR PRIVATE ENVIRONMENT</Text>
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
    paddingHorizontal: 28,
    paddingVertical: 24,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  seal: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: 'rgba(201,168,106,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  sealText: {
    fontSize: 28,
    color: Palette.goldLight,
    fontWeight: '600',
  },
  eyebrow: {
    marginBottom: 0,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#BBC9C1',
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 320,
  },
  subtitleDetail: {
    textAlign: 'center',
    color: '#8FA698',
    fontSize: 13,
    lineHeight: 20,
    maxWidth: 320,
  },
  progressTrack: {
    width: '100%',
    maxWidth: 280,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginTop: Spacing.four,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Palette.gold,
  },
  caption: {
    fontSize: 8,
    letterSpacing: 2,
    color: '#8FA698',
    marginTop: Spacing.two,
  },
});
