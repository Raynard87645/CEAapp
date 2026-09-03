import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { EyebrowText, SerifTitle } from '@/components/ui/typography';
import { Fonts, Palette, Spacing } from '@/constants/theme';
import type { AddOnItem } from '@/services/api/types';

function statusStyle(status: string) {
  if (status.includes('Approved')) return styles.statusApproved;
  if (status === 'Processing') return styles.statusProcessing;
  if (status === 'Confirmed') return styles.statusConfirmed;
  if (status === 'Not Approved') return styles.statusDeclined;
  return styles.statusAvailable;
}

type AddonsCatalogProps = {
  addOns: AddOnItem[];
  readOnly?: boolean;
  onRequestAddon?: (id: number) => void;
  onPay?: (id: number) => void;
  subtitle?: string;
};

export function AddonsCatalog({
  addOns,
  readOnly = false,
  onRequestAddon,
  onPay,
  subtitle = 'Request an experience. Alicia will review the details before payment.',
}: AddonsCatalogProps) {
  return (
    <>
      <View style={styles.head}>
        <EyebrowText>CURATED FOR YOUR JOURNEY</EyebrowText>
        <SerifTitle size="page">
          Private <Text style={styles.accent}>add-ons</Text>
        </SerifTitle>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.flowNote}>
        <Text style={styles.flowStep}>1 Request</Text>
        <Text style={styles.flowArrow}>→</Text>
        <Text style={styles.flowStep}>2 CEA review</Text>
        <Text style={styles.flowArrow}>→</Text>
        <Text style={styles.flowStep}>3 Payment</Text>
        <Text style={styles.flowArrow}>→</Text>
        <Text style={styles.flowStep}>4 Confirmed</Text>
      </View>

      <View style={styles.grid}>
        {addOns.map((addon, index) => (
          <View key={`${addon.catalogKey}-${addon.id}`} style={styles.card}>
            <Image
              source={{ uri: addon.image }}
              style={styles.cardImage}
              contentFit="cover"
              transition={200}
            />
            <View style={styles.cardOverlay}>
              <Text style={styles.cardIndex}>0{index + 1}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={[styles.status, statusStyle(addon.status)]}>{addon.status}</Text>
              <Text style={styles.cardTitle}>{addon.name}</Text>
              <Text style={styles.cardDesc}>{addon.description}</Text>
              <Text style={styles.cardPrice}>{addon.price}</Text>

              {!readOnly && addon.status === 'Available' && onRequestAddon ? (
                <AppButton
                  label="Request Add-On"
                  variant="outline"
                  onPress={() => onRequestAddon(addon.id)}
                />
              ) : null}
              {!readOnly && addon.status === 'Processing' ? (
                <AppButton label="With your CEA" variant="outline" disabled />
              ) : null}
              {!readOnly && addon.status.includes('Approved') && onPay ? (
                <AppButton label="Pay Now" onPress={() => onPay(addon.id)} />
              ) : null}
              {addon.status === 'Confirmed' ? (
                <View style={styles.confirmedBadge}>
                  <Text style={styles.confirmedText}>✓ Confirmed</Text>
                </View>
              ) : null}
            </View>
          </View>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  head: {
    gap: 10,
  },
  accent: {
    fontFamily: Fonts.serif,
    fontStyle: 'italic',
    color: Palette.greenLight,
  },
  subtitle: {
    color: Palette.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  flowNote: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.line,
    padding: 12,
  },
  flowStep: {
    fontSize: 9,
    fontWeight: '700',
    color: Palette.green,
  },
  flowArrow: {
    color: Palette.muted,
    fontSize: 10,
  },
  grid: {
    gap: 10,
  },
  card: {
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.line,
    overflow: 'hidden',
  },
  cardImage: {
    height: 120,
    width: '100%',
  },
  cardOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  cardIndex: {
    color: Palette.white,
    fontSize: 12,
    fontWeight: '700',
    textShadowColor: '#000',
    textShadowRadius: 6,
  },
  cardBody: {
    padding: 16,
    gap: 8,
  },
  status: {
    alignSelf: 'flex-start',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  statusAvailable: {
    color: Palette.green,
    backgroundColor: '#EEF3EA',
  },
  statusProcessing: {
    color: '#8A6A2D',
    backgroundColor: '#F7F0E0',
  },
  statusApproved: {
    color: Palette.green,
    backgroundColor: Palette.sage,
  },
  statusConfirmed: {
    color: Palette.green,
    backgroundColor: Palette.sage,
  },
  statusDeclined: {
    color: '#7A4444',
    backgroundColor: '#F6ECEC',
  },
  cardTitle: {
    fontFamily: Fonts.serif,
    fontSize: 20,
    color: Palette.ink,
  },
  cardDesc: {
    fontSize: 11,
    color: Palette.muted,
    lineHeight: 16,
  },
  cardPrice: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.ink,
  },
  confirmedBadge: {
    paddingVertical: 10,
  },
  confirmedText: {
    color: Palette.green,
    fontSize: 11,
    fontWeight: '700',
  },
});

export { Spacing };
