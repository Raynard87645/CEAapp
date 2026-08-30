import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, Palette, Typography } from '@/constants/theme';

type EyebrowTextProps = TextProps & {
  light?: boolean;
};

export function EyebrowText({ light = false, style, ...rest }: EyebrowTextProps) {
  return (
    <Text
      style={[styles.eyebrow, light && styles.light, style]}
      accessibilityRole="text"
      {...rest}
    />
  );
}

type SerifTitleProps = TextProps & {
  size?: 'hero' | 'page' | 'section';
  accent?: boolean;
};

export function SerifTitle({ size = 'page', accent = false, style, ...rest }: SerifTitleProps) {
  return (
    <Text
      style={[
        size === 'hero' && styles.hero,
        size === 'page' && styles.page,
        size === 'section' && styles.section,
        accent && styles.accent,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    ...Typography.eyebrow,
    color: Palette.greenMuted,
  },
  light: {
    color: '#BDCABE',
  },
  hero: {
    ...Typography.heroTitle,
    color: Palette.white,
  },
  page: {
    ...Typography.pageTitle,
    color: Palette.ink,
  },
  section: {
    ...Typography.sectionTitle,
    color: Palette.ink,
  },
  accent: {
    color: Palette.goldLight,
    fontStyle: 'italic',
  },
});
