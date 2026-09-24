import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppHeader } from '@/components/app-header';
import { AppButton } from '@/components/ui/app-button';
import { AppDialog } from '@/components/ui/app-dialog';
import { SuccessBanner } from '@/components/ui/success-banner';
import {
  EyebrowText,
  SerifTitle,
} from '@/components/ui/typography';
import { MESSAGE_QUICK_OPTIONS } from '@/constants/mock-data';
import {
  Fonts,
  Layout,
  Palette,
  Spacing,
} from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useJourney } from '@/context/journey-context';
import { api } from '@/services/api/client';
import type { JourneySummary } from '@/services/api/types';

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return 'CEA';
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export default function MessagesScreen() {
  const { avatarUri, pickAvatar, refreshUpdates } = useJourney();
  const { bookingId } = useAuth();

  const [journey, setJourney] =
    useState<JourneySummary | null>(null);

  const [selectedOption, setSelectedOption] =
    useState<string>(MESSAGE_QUICK_OPTIONS[0]);

  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const [dialog, setDialog] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const showDialog = (
    title: string,
    message = '',
  ) => {
    setDialog({
      visible: true,
      title,
      message,
    });
  };

  const closeDialog = () => {
    setDialog((current) => ({
      ...current,
      visible: false,
    }));
  };

  useEffect(() => {
    let active = true;

    async function loadJourney() {
      if (!bookingId) {
        if (active) {
          setJourney(null);
        }
        return;
      }

      try {
        const response =
          await api.bookingOverview(bookingId);

        if (active) {
          setJourney(response.journey);
        }
      } catch {
        if (active) {
          setJourney(null);
        }
      }
    }

    void loadJourney();

    return () => {
      active = false;
    };
  }, [bookingId]);

  const ceaName = journey?.ceaName ?? 'Your CEA';

  const ceaInitials = useMemo(
    () => initialsFromName(ceaName),
    [ceaName],
  );

  const handleSend = async () => {
    const trimmedMessage = message.trim();

    if (!bookingId) {
      showDialog(
        'Booking unavailable',
        'We could not determine your booking.',
      );

      return;
    }

    if (!trimmedMessage) {
      showDialog(
        'Message required',
        'Please enter a message for your CEA.',
      );

      return;
    }

    if (sending) {
      return;
    }

    setSending(true);
    setSent(false);

    try {
      await api.sendBookingMessage(
        bookingId,
        {
          category: selectedOption,
          message: trimmedMessage,
        },
      );

      await refreshUpdates();

      setMessage('');
      setSent(true);

      setTimeout(() => {
        setSent(false);
      }, 3500);
    } catch (error) {
      console.error(
        'Unable to send client message:',
        error,
      );

      showDialog(
        'Unable to send message',
        'Please try again.',
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.screen}>
      <AppHeader
        avatarUri={avatarUri}
        onAvatarPress={pickAvatar}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.head}>
          <EyebrowText>
            YOUR PRIVATE SUPPORT
          </EyebrowText>

          <SerifTitle size="page">
            Message{' '}
            <Text style={styles.accent}>
              {journey?.ceaName?.split(' ')[0] ??
                'your CEA'}
            </Text>
          </SerifTitle>

          <Text style={styles.subtitle}>
            Send a simple note to your Client
            Experience Architect.
          </Text>
        </View>

        <View style={styles.ceaCard}>
          <View style={styles.ceaAvatar}>
            <Text style={styles.ceaInitials}>
              {ceaInitials}
            </Text>
          </View>

          <View style={styles.ceaCopy}>
            <Text style={styles.ceaLabel}>
              YOUR CEA
            </Text>

            <Text style={styles.ceaName}>
              {ceaName}
            </Text>

            <Text style={styles.ceaRole}>
              Client Experience Architect
            </Text>
          </View>

          <Text style={styles.ceaReply}>
            Usually replies within 1 hour
          </Text>
        </View>

        {sent ? (
          <SuccessBanner
            title="Message sent"
            message="Your Client Experience Architect has been notified."
          />
        ) : null}

        <View style={styles.form}>
          <Text style={styles.label}>
            How can we help?
          </Text>

          <View style={styles.options}>
            {MESSAGE_QUICK_OPTIONS.map(
              (option) => (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  disabled={sending}
                  onPress={() =>
                    setSelectedOption(option)
                  }
                  style={[
                    styles.option,
                    selectedOption === option &&
                      styles.optionActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedOption === option &&
                        styles.optionTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              ),
            )}
          </View>

          <Text style={styles.label}>
            Your message
          </Text>

          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder={`Add a note for ${
              journey?.ceaName?.split(' ')[0] ??
              'your CEA'
            }…`}
            placeholderTextColor={Palette.muted}
            multiline
            editable={!sending}
            maxLength={2000}
            style={styles.textarea}
          />

          <AppButton
            label={
              sending
                ? 'Sending…'
                : 'Send to CEA →'
            }
            fullWidth
            disabled={
              sending ||
              !message.trim() ||
              !bookingId
            }
            loading={sending}
            onPress={() => void handleSend()}
          />

          <Text style={styles.formNote}>
            This message will be attached to
            your booking and sent to your
            Client Experience Architect.
          </Text>
        </View>
      </ScrollView>

      <AppDialog
        visible={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        confirmLabel="OK"
        onConfirm={closeDialog}
        onCancel={closeDialog}
      />
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
      Layout.bottomNavHeight +
      Spacing.five,
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

  ceaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.line,
    padding: 18,
  },

  ceaAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ceaInitials: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.green,
  },

  ceaCopy: {
    flex: 1,
    gap: 2,
  },

  ceaLabel: {
    fontSize: 8,
    letterSpacing: 1.2,
    color: Palette.muted,
    fontWeight: '700',
  },

  ceaName: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    color: Palette.ink,
  },

  ceaRole: {
    fontSize: 10,
    color: Palette.muted,
  },

  ceaReply: {
    fontSize: 8,
    color: '#B9C7BE',
    maxWidth: 80,
    textAlign: 'right',
  },

  form: {
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.line,
    padding: 24,
    gap: 12,
  },

  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Palette.ink,
  },

  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },

  option: {
    width: '48%',
    borderWidth: 1,
    borderColor: Palette.line,
    backgroundColor: Palette.paper,
    padding: 10,
  },

  optionActive: {
    borderColor: Palette.green,
    backgroundColor: '#EEF3EA',
  },

  optionText: {
    fontSize: 9,
    color: '#5E6862',
    lineHeight: 13,
  },

  optionTextActive: {
    color: Palette.green,
    fontWeight: '700',
  },

  textarea: {
    borderWidth: 1,
    borderColor: Palette.line,
    backgroundColor: Palette.paper,
    minHeight: 120,
    padding: 14,
    fontSize: 14,
    color: Palette.ink,
    textAlignVertical: 'top',
  },

  formNote: {
    textAlign: 'center',
    fontSize: 8,
    color: Palette.muted,
  },
});