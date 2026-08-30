import { StyleSheet, Text, View, type ViewProps } from 'react-native';

import { Palette, Spacing } from '@/constants/theme';

type SuccessBannerProps = ViewProps & {
  title: string;
  message: string;
};

export function SuccessBanner({ title, message, style, ...rest }: SuccessBannerProps) {
  return (
    <View style={[styles.banner, style]} accessibilityRole="alert" {...rest}>
      <Text style={styles.icon}>✓</Text>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: Palette.sage,
    padding: 15,
    marginTop: Spacing.three,
  },
  icon: {
    fontSize: 16,
    color: Palette.green,
    fontWeight: '700',
    marginTop: 2,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.ink,
  },
  message: {
    fontSize: 9,
    color: '#536159',
    lineHeight: 14,
  },
});
