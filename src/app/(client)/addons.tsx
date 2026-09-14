import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AddonsCatalog } from '@/components/addons-catalog';
import { AppHeader } from '@/components/app-header';
import { CepAddonsScreen } from '@/components/cep/cep-addons-screen';
import { AppButton } from '@/components/ui/app-button';
import { SuccessBanner } from '@/components/ui/success-banner';
import {
  EyebrowText,
  SerifTitle,
} from '@/components/ui/typography';
import { isExperienceHost } from '@/constants/platforms';
import { Layout, Palette, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useJourney } from '@/context/journey-context';
import { api } from '@/services/api/client';
import type { AddOnItem } from '@/services/api/types';

export default function AddonsScreen() {
  const { role, fullName } = useAuth();

  if (isExperienceHost(role)) {
    return <CepAddonsScreen />;
  }

  return <ClientAddonsScreen fullName={fullName} />;
}

function ClientAddonsScreen({
  fullName,
}: {
  fullName: string;
}) {
  const { bookingId } = useAuth();

  const { avatarUri, pickAvatar, refreshUpdates } = useJourney();

  const [addons, setAddons] = useState<AddOnItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] =
    useState<number | null>(null);

  const [paymentId, setPaymentId] =
    useState<number | null>(null);
  const [paying, setPaying] = useState(false);

  const [customTitle, setCustomTitle] = useState('');
  const [customDetails, setCustomDetails] = useState('');
  const [customSent, setCustomSent] = useState(false);
  const [customSending, setCustomSending] = useState(false);

  const selectedAddon = addons.find(
    (addon) => addon.id === paymentId,
  );

  const loadAddOns = useCallback(async () => {
    if (!bookingId) {
      setAddons([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response =
        await api.bookingAddOns(bookingId);

      setAddons(response.addOns ?? []);
    } catch (error) {
      console.error(error);

      Alert.alert(
        'Unable to load add-ons',
        error instanceof Error
          ? error.message
          : 'Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    void loadAddOns();
  }, [loadAddOns]);

  const requestAddon = async (addonId: number) => {
    if (!bookingId) {
      Alert.alert(
        'Booking unavailable',
        'Your booking could not be identified.',
      );
      return;
    }

    const addon = addons.find(
      (item) => item.id === addonId,
    );

    if (!addon) {
      return;
    }

    if (addon.status !== 'Available') {
      return;
    }

    try {
      setRequestingId(addonId);

      await api.requestBookingAddOn(
        bookingId,
        {
          title: addon.name,
          description: addon.description,
        },
      );

      await loadAddOns();
      await refreshUpdates();
    } catch (error) {
      console.error(error);

      Alert.alert(
        'Request failed',
        error instanceof Error
          ? error.message
          : 'Please try again.',
      );
    } finally {
      setRequestingId(null);
    }
  };

  const submitCustom = async () => {
    if (
      !bookingId ||
      !customTitle.trim() ||
      !customDetails.trim()
    ) {
      return;
    }

    try {
      setCustomSending(true);

      await api.requestBookingAddOn(
        bookingId,
        {
          title: customTitle.trim(),
          description: customDetails.trim(),
          clientNotes: customDetails.trim(),
        },
      );

      setCustomTitle('');
      setCustomDetails('');
      setCustomSent(true);

      await loadAddOns();
      await refreshUpdates();

      setTimeout(() => {
        setCustomSent(false);
      }, 3500);
    } catch (error) {
      console.error(error);

      Alert.alert(
        'Request failed',
        error instanceof Error
          ? error.message
          : 'Please try again.',
      );
    } finally {
      setCustomSending(false);
    }
  };

  /*
   * Still prototype-only for now.
   * This is separate from the new add-on request flow.
   */
  const handlePay = () => {
    if (paymentId === null) {
      return;
    }

    setPaying(true);

    setTimeout(() => {
      setPaymentId(null);
      setPaying(false);
    }, 1200);
  };

  return (
    <View style={styles.screen}>
      <AppHeader avatarUri={avatarUri} onAvatarPress={pickAvatar} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingBox}>
            <Text style={styles.loadingText}>
              Loading available add-ons…
            </Text>
          </View>
        ) : (
          <AddonsCatalog
            addOns={addons.map((addon) => ({
              id: addon.id,
              catalogKey: addon.catalogKey,
              name: addon.name,
              description: addon.description,
              price: addon.price,
              image: addon.image,
              status: addon.status,
              requestId: addon.requestId,
              notApprovedReason:
                addon.notApprovedReason,
            }))}
            onRequestAddon={requestAddon}
            onPay={setPaymentId}
            requestingId={requestingId}
          />
        )}

        <View style={styles.customSection}>
          <EyebrowText>
            PERSONALIZED FOR YOU
          </EyebrowText>

          <SerifTitle size="section">
            Custom Request
          </SerifTitle>

          <Text style={styles.customCopy}>
            Looking for something not listed?
            Share what you have in mind and your
            Client Experience Architect will
            review the request.
          </Text>

          {customSent && (
            <SuccessBanner
              title="Custom request sent"
              message="Your request has been submitted. Status: Requested."
            />
          )}

          <View style={styles.customFields}>
            <View style={styles.field}>
              <Text style={styles.label}>
                Request Title
              </Text>

              <TextInput
                value={customTitle}
                onChangeText={setCustomTitle}
                placeholder="What would you like to arrange?"
                placeholderTextColor={Palette.muted}
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Request Details
              </Text>

              <TextInput
                value={customDetails}
                onChangeText={setCustomDetails}
                placeholder="Share timing, preferences, and any helpful details…"
                placeholderTextColor={Palette.muted}
                multiline
                style={[
                  styles.input,
                  styles.textarea,
                ]}
              />
            </View>

            <AppButton
              label={
                customSending
                  ? 'Submitting…'
                  : 'Submit Custom Request'
              }
              loading={customSending}
              onPress={submitCustom}
              disabled={
                customSending ||
                !bookingId ||
                !customTitle.trim() ||
                !customDetails.trim()
              }
            />
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={paymentId !== null}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setPaymentId(null)
        }
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modal}>
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                setPaymentId(null)
              }
              style={styles.close}
            >
              <Text style={styles.closeText}>
                ×
              </Text>
            </Pressable>

            <EyebrowText>
              PROTOTYPE PAYMENT
            </EyebrowText>

            <SerifTitle size="section">
              Complete your request
            </SerifTitle>

            <View style={styles.paymentLine}>
              <Text style={styles.paymentName}>
                {selectedAddon?.name}
              </Text>

              <Text style={styles.paymentAmount}>
                {selectedAddon?.price ??
                  'Price to be confirmed'}
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Cardholder name
              </Text>

              <TextInput
                value={fullName}
                editable={false}
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Card details
              </Text>

              <TextInput
                value="4242 4242 4242 4242"
                editable={false}
                style={styles.input}
              />
            </View>

            <Text style={styles.mockNote}>
              ▣ Demonstration only. No real
              payment will be processed.
            </Text>

            <AppButton
              label={
                paying
                  ? 'Confirming…'
                  : 'Confirm Payment'
              }
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
    paddingBottom:
      Layout.bottomNavHeight + Spacing.five,
    gap: Spacing.four,
  },

  loadingBox: {
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.line,
    padding: 24,
  },

  loadingText: {
    fontSize: 12,
    color: Palette.muted,
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
    backgroundColor:
      'rgba(14,33,27,0.55)',
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