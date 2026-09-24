import { ReactNode } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { DriverColors } from '@/constants/driver-colors';

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Pill({
  children,
  tone = 'green',
}: {
  children: ReactNode;
  tone?: 'green' | 'gold' | 'gray';
}) {
  const toneStyle =
    tone === 'gold' ? styles.pillGold : tone === 'gray' ? styles.pillGray : styles.pillGreen;

  return (
    <View style={[styles.pill, toneStyle]}>
      <Text style={[styles.pillText, tone === 'gold' && styles.pillGoldText]}>{children}</Text>
    </View>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <Text style={styles.eyebrow}>{children}</Text>;
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

export function DetailGrid({ items }: { items: Array<{ label: string; value: string }> }) {
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <View key={item.label} style={[styles.detail, item.value.length > 28 && styles.detailWide]}>
          <Text style={styles.detailLabel}>{item.label}</Text>
          <Text style={styles.detailValue}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: DriverColors.paper,
    borderColor: DriverColors.line,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#233c2d',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 7 },
    elevation: 2,
  },
  pill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  pillGreen: {
    backgroundColor: '#effde6',
  },
  pillGold: {
    backgroundColor: '#f1e8d1',
  },
  pillGray: {
    backgroundColor: '#eeeae1',
  },
  pillText: {
    color: '#3F6F2D',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  pillGoldText: {
    color: '#775b20',
  },
  eyebrow: {
    color: DriverColors.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: DriverColors.ink,
  },
  subtitle: {
    color: DriverColors.muted,
    fontSize: 13,
    marginTop: 5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detail: {
    width: '47%',
  },
  detailWide: {
    width: '100%',
  },
  detailLabel: {
    color: DriverColors.muted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  detailValue: {
    color: DriverColors.ink,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
});
