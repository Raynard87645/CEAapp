import { Image } from 'expo-image';
import { StyleSheet, Text, View, type ViewProps } from 'react-native';

import { Fonts, Palette, Spacing } from '@/constants/theme';

type BrandHeaderProps = ViewProps & {
  light?: boolean;
  compact?: boolean;
};

export function BrandHeader({ light = false, compact = false, style, ...rest }: BrandHeaderProps) {
  return (
    <View style={[styles.brand, compact && styles.compact, style]} {...rest}>
      <Image
        source={require('@/assets/images/company-logo.png')}
        style={[styles.logo, compact && styles.logoCompact]}
        contentFit="cover"
        accessibilityLabel="Tour Jamaica Ground Transport logo"
      />
      <View>
        <Text style={[styles.brandTitle, light && styles.brandTitleLight]}>TOUR JAMAICA</Text>
        <Text style={[styles.brandSubtitle, light && styles.brandSubtitleLight]}>
          GROUND TRANSPORT
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  compact: {
    gap: 9,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  logoCompact: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  brandTitle: {
    fontFamily: Fonts.serif,
    fontSize: 13,
    letterSpacing: 2.5,
    color: Palette.ink,
    fontWeight: '600',
  },
  brandTitleLight: {
    color: Palette.white,
  },
  brandSubtitle: {
    marginTop: 4,
    fontSize: 6,
    letterSpacing: 2.5,
    color: Palette.muted,
    fontWeight: '600',
  },
  brandSubtitleLight: {
    color: '#B4C3BA',
  },
});
