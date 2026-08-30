import { Image } from 'expo-image';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppHeader } from '@/components/app-header';
import { AppButton } from '@/components/ui/app-button';
import { SuccessBanner } from '@/components/ui/success-banner';
import { EyebrowText, SerifTitle } from '@/components/ui/typography';
import type { Addon } from '@/constants/mock-data';
import { Fonts, Layout, Palette, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useJourney } from '@/context/journey-context';

function statusStyle(status: Addon['status']) {
  if (status.includes('Approved')) return styles.statusApproved;
  if (status === 'Processing') return styles.statusProcessing;
  if (status === 'Confirmed') return styles.statusConfirmed;
  return styles.statusAvailable;
}

export default function AddonsScreen() {
  const { fullName } = useAuth();
  const { updates, addons, avatarUri, markRead, pickAvatar, requestAddon, confirmPayment, addUpdate } =
    useJourney();

  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [paying, setPaying] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customDetails, setCustomDetails] = useState('');
  const [customSent, setCustomSent] = useState(false);

  const selectedAddon = addons.find((addon) => addon.id === paymentId);

  const handlePay = () => {
    if (paymentId === null) return;
    setPaying(true);
    setTimeout(() => {
      confirmPayment(paymentId);
      setPaymentId(null);
      setPaying(false);
    }, 1200);
  };

  const submitCustom = () => {
    if (!customTitle.trim() || !customDetails.trim()) return;
    setCustomSent(true);
    addUpdate('Custom request sent to your Client Experience Architect.', 'Add-on request update');
    setCustomTitle('');
    setCustomDetails('');
    setTimeout(() => setCustomSent(false), 3500);
  };

  return (
    <View style={styles.screen}>
      <AppHeader updates={updates} avatarUri={avatarUri} onAvatarPress={pickAvatar} onNotificationPress={markRead} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.head}>
          <EyebrowText>CURATED FOR YOUR JOURNEY</EyebrowText>
          <SerifTitle size="page">
            Private <Text style={styles.accent}>add-ons</Text>
          </SerifTitle>
          <Text style={styles.subtitle}>
            Request an experience. Alicia will review the details before payment.
          </Text>
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
          {addons.map((addon, index) => (
            <View key={addon.id} style={styles.card}>
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

                {addon.status === 'Available' && (
                  <AppButton
                    label="Request Add-On"
                    variant="outline"
                    onPress={() => requestAddon(addon.id)}
                  />
                )}
                {addon.status === 'Processing' && (
                  <AppButton label="With your CEA" variant="outline" disabled />
                )}
                {addon.status.includes('Approved') && (
                  <AppButton label="Pay Now" onPress={() => setPaymentId(addon.id)} />
                )}
                {addon.status === 'Confirmed' && (
                  <View style={styles.confirmedBadge}>
                    <Text style={styles.confirmedText}>✓ Confirmed</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.customSection}>
          <EyebrowText>PERSONALIZED FOR YOU</EyebrowText>
          <SerifTitle size="section">Custom Request</SerifTitle>
          <Text style={styles.customCopy}>
            Looking for something not listed? Share what you have in mind and your Client Experience
            Architect will review the request.
          </Text>

          {customSent && (
            <SuccessBanner
              title="Custom request sent"
              message="To your Client Experience Architect. Status: Processing."
            />
          )}

          <View style={styles.customFields}>
            <View style={styles.field}>
              <Text style={styles.label}>Request Title</Text>
              <TextInput
                value={customTitle}
                onChangeText={setCustomTitle}
                placeholder="What would you like to arrange?"
                placeholderTextColor={Palette.muted}
                style={styles.input}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Request Details</Text>
              <TextInput
                value={customDetails}
                onChangeText={setCustomDetails}
                placeholder="Share timing, preferences, and any helpful details…"
                placeholderTextColor={Palette.muted}
                multiline
                style={[styles.input, styles.textarea]}
              />
            </View>
            <AppButton
              label="Submit Custom Request"
              onPress={submitCustom}
              disabled={!customTitle.trim() || !customDetails.trim()}
            />
          </View>
        </View>
      </ScrollView>

      <Modal visible={paymentId !== null} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modal}>
            <Pressable accessibilityRole="button" onPress={() => setPaymentId(null)} style={styles.close}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>
            <EyebrowText>PROTOTYPE PAYMENT</EyebrowText>
            <SerifTitle size="section">Complete your request</SerifTitle>
            <View style={styles.paymentLine}>
              <Text style={styles.paymentName}>{selectedAddon?.name}</Text>
              <Text style={styles.paymentAmount}>US$1,450</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Cardholder name</Text>
              <TextInput value={fullName} editable={false} style={styles.input} />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Card details</Text>
              <TextInput value="4242 4242 4242 4242" editable={false} style={styles.input} />
            </View>
            <Text style={styles.mockNote}>▣ Demonstration only. No real payment will be processed.</Text>
            <AppButton
              label={paying ? 'Confirming…' : 'Pay US$1,450'}
              fullWidth
              loading={paying}
              onPress={handlePay}
            />
          </View>
        </View>
      </Modal>
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
  content: {
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: Layout.bottomNavHeight + Spacing.five,
    gap: Spacing.four,
  },
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
  customSection: {
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.line,
    padding: 24,
    gap: 10,
  },
  customCopy: {
    fontSize: 10,
    lineHeight: 15,
    color: Palette.muted,
  },
  customFields: {
    gap: 12,
    marginTop: 8,
  },
  field: {
    gap: 7,
  },
  label: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Palette.ink,
  },
  input: {
    borderWidth: 1,
    borderColor: Palette.line,
    backgroundColor: Palette.paper,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: Palette.ink,
  },
  textarea: {
    minHeight: 104,
    textAlignVertical: 'top',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(14,33,27,0.55)',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: Palette.paper,
    padding: 24,
    gap: 12,
    maxWidth: 430,
    width: '100%',
    alignSelf: 'center',
  },
  close: {
    alignSelf: 'flex-end',
    padding: 4,
  },
  closeText: {
    fontSize: 24,
    color: Palette.muted,
  },
  paymentLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Palette.line,
  },
  paymentName: {
    fontSize: 12,
    color: Palette.ink,
    flex: 1,
    paddingRight: 12,
  },
  paymentAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.ink,
  },
  mockNote: {
    fontSize: 9,
    color: Palette.muted,
    textAlign: 'center',
  },
});
