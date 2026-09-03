import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BrandHeader } from '@/components/brand-header';
import { EyebrowText, SerifTitle } from '@/components/ui/typography';
import type { PlatformConfig } from '@/constants/platforms';
import { Layout, Palette, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';

type PlatformScreenProps = {
  platform: PlatformConfig;
  title: string;
  subtitle: string;
  body?: string;
};

export function PlatformScreen({ platform, title, subtitle, body }: PlatformScreenProps) {
  const { firstName, fullName, roleLabel, platformLabel } = useAuth();

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <BrandHeader compact />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{roleLabel.slice(0, 2).toUpperCase()}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <EyebrowText>{platform.eyebrow}</EyebrowText>
        <SerifTitle size="page">{title}</SerifTitle>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Signed in as</Text>
          <Text style={styles.cardName}>{fullName || firstName}</Text>
          <Text style={styles.cardMeta}>
            {roleLabel} · {platformLabel || platform.label}
          </Text>
          {body ? <Text style={styles.cardBody}>{body}</Text> : null}
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
  header: {
    backgroundColor: Palette.paper,
    borderBottomWidth: 1,
    borderBottomColor: Palette.line,
    height: Layout.headerHeight,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Palette.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.green,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: Layout.bottomNavHeight + Spacing.five,
    gap: Spacing.three,
  },
  subtitle: {
    color: Palette.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  card: {
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.line,
    borderRadius: 8,
    padding: 18,
    gap: 8,
    marginTop: Spacing.two,
  },
  cardLabel: {
    fontSize: 8,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Palette.muted,
    fontWeight: '700',
  },
  cardName: {
    fontFamily: 'Georgia',
    fontSize: 24,
    color: Palette.ink,
  },
  cardMeta: {
    color: Palette.green,
    fontSize: 11,
    fontWeight: '700',
  },
  cardBody: {
    color: Palette.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
});
