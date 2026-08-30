import { StyleSheet, Text, View, type ViewProps } from 'react-native';

import { Fonts, Palette, Spacing } from '@/constants/theme';

type SummaryCardProps = ViewProps & {
  icon: string;
  label: string;
  value: string;
  sub: string;
};

export function SummaryCard({ icon, label, value, sub, style, ...rest }: SummaryCardProps) {
  return (
    <View style={[styles.card, style]} {...rest}>
      <Text style={styles.icon} accessibilityElementsHidden>
        {icon}
      </Text>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.sub}>{sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.line,
    borderRadius: 8,
    padding: 18,
    minHeight: 135,
    gap: 4,
  },
  icon: {
    fontSize: 18,
    color: Palette.gold,
    marginBottom: 4,
  },
  label: {
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Palette.muted,
    fontWeight: '700',
  },
  value: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    color: Palette.ink,
    marginTop: 2,
  },
  sub: {
    fontSize: 10,
    color: Palette.muted,
    marginTop: 2,
  },
});
