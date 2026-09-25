import { AppDialog } from '@/components/ui/app-dialog';
import { DriverColors } from '@/constants/driver-colors';
import { useAuth } from '@/context/auth-context';
import { api } from '@/services/api/client';
import { driverApi } from '@/services/api/driver';
import type {
  Message,
  MessageConversationType,
  MessageParticipant,
} from '@/services/api/types';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

type ChatContact = MessageParticipant & {
  messages: Message[];
};

function formatMessageTime(value: string | null) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date
    .toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
    .toLowerCase();
}

export default function MessagesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { role } = useAuth();

  const messageListRef = useRef<FlatList<Message>>(null);

  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const [dialog, setDialog] = useState<{
    visible: boolean;
    title: string;
    message: string;
  }>({
    visible: false,
    title: '',
    message: '',
  });

  const activeContact =
    contacts.find((contact) => contact.id === activeChatId) ??
    contacts[0] ??
    null;

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return contacts;
    }

    return contacts.filter((contact) =>
      `${contact.name} ${contact.role}`
        .toLowerCase()
        .includes(query),
    );
  }, [contacts, search]);

  const conversationType = useMemo<MessageConversationType | null>(() => {
    if (!activeContact) {
      return null;
    }

    if (role === 'client') {
      return 'client_driver';
    }

    if (role === 'driver') {
      return activeContact.role === 'Client'
        ? 'client_driver'
        : 'driver_cea';
    }

    return null;
  }, [activeContact, role]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);

        setTimeout(() => {
          messageListRef.current?.scrollToEnd({
            animated: true,
          });
        }, 100);
      },
    );

    const hideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadParticipants() {
      setLoading(true);

      try {
        const response =
          role === 'driver'
            ? await driverApi.messageParticipants()
            : await api.messageParticipants();

        if (cancelled) {
          return;
        }

        const nextContacts: ChatContact[] =
          response.participants.map((participant) => ({
            ...participant,
            messages: [],
          }));

        setContacts(nextContacts);

        setActiveChatId(
          nextContacts.length
            ? nextContacts[0].id
            : null,
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          'MESSAGE PARTICIPANTS ERROR:',
          error,
        );

        setDialog({
          visible: true,
          title: 'Messages unavailable',
          message:
            error instanceof Error
              ? error.message
              : 'Unable to load your message participants.',
        });
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadParticipants();

    return () => {
      cancelled = true;
    };
  }, [role]);

  useEffect(() => {
    if (!activeContact || !conversationType) {
      return;
    }

    const type = conversationType;

    let cancelled = false;

    async function loadMessages() {
      setMessagesLoading(true);

      try {
        const response =
          role === 'driver'
            ? await driverApi.messages(type)
            : await api.messages();

        if (cancelled) {
          return;
        }

        setContacts((current) =>
          current.map((contact) =>
            contact.id === activeContact.id
              ? {
                  ...contact,
                  messages: response.messages,
                }
              : contact,
          ),
        );

        if (role === 'driver') {
          await driverApi.markMessagesRead(type);
        } else {
          await api.markMessagesRead();
        }

        if (cancelled) {
          return;
        }

        setTimeout(() => {
          messageListRef.current?.scrollToEnd({
            animated: false,
          });
        }, 50);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          'MESSAGES LOAD ERROR:',
          error,
        );

        setDialog({
          visible: true,
          title: 'Conversation unavailable',
          message:
            error instanceof Error
              ? error.message
              : 'Unable to load this conversation.',
        });
      } finally {
        if (!cancelled) {
          setMessagesLoading(false);
        }
      }
    }

    loadMessages();

    return () => {
      cancelled = true;
    };
  }, [
    activeContact?.id,
    conversationType,
    role,
  ]);

  function selectContact(contactId: string) {
    setActiveChatId(contactId);

    setTimeout(() => {
      messageListRef.current?.scrollToEnd({
        animated: false,
      });
    }, 50);
  }

  async function sendMessage() {
    const trimmed = message.trim();

    if (
      !trimmed ||
      !activeContact ||
      !conversationType ||
      sending
    ) {
      return;
    }

    const type = conversationType;

    setSending(true);

    try {
      const response =
        role === 'driver'
          ? await driverApi.sendMessage(
              type,
              trimmed,
            )
          : await api.sendMessage(trimmed);

      const sentMessage = response.message;

      setContacts((current) =>
        current.map((contact) =>
          contact.id === activeContact.id
            ? {
                ...contact,
                messages: [
                  ...contact.messages,
                  sentMessage,
                ],
              }
            : contact,
        ),
      );

      setMessage('');

      setTimeout(() => {
        messageListRef.current?.scrollToEnd({
          animated: true,
        });
      }, 80);
    } catch (error) {
      console.error(
        'SEND MESSAGE ERROR:',
        error,
      );

      setDialog({
        visible: true,
        title: 'Message not sent',
        message:
          error instanceof Error
            ? error.message
            : 'Unable to send your message. Please try again.',
      });
    } finally {
      setSending(false);
    }
  }

  function handleAttachment() {
    setDialog({
      visible: true,
      title: 'Attach file',
      message:
        'File attachments will be connected to the messaging service later.',
    });
  }

  function closeDialog() {
    setDialog((current) => ({
      ...current,
      visible: false,
    }));
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : 'height'
      }
      keyboardVerticalOffset={0}>
      <View style={styles.screen}>
        <View
          style={[
            styles.chatHeader,
            {
              paddingTop: insets.top + 2,
            },
          ]}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Close messages">
            <Svg width={20} height={20} viewBox="0 0 24 24">
              <Path
                d="M15 5L8 12L15 19"
                stroke="#FFFFFF"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </Svg>
          </Pressable>

          <View style={styles.chatHeaderCopy}>
            <Text style={styles.chatHeaderEyebrow}>
              PRIVATE COMMUNICATIONS
            </Text>

            <Text style={styles.chatHeaderTitle}>
              Messages
            </Text>
          </View>
        </View>

        <View style={styles.body}>
          {!keyboardVisible && (
            <View style={styles.contactTools}>
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search contacts and team"
                placeholderTextColor={DriverColors.muted}
                style={styles.searchInput}
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="search"
              />

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.contactList}>
                {filteredContacts.length ? (
                  filteredContacts.map((contact) => {
                    const active =
                      contact.id === activeChatId;

                    return (
                      <Pressable
                        key={contact.id}
                        onPress={() =>
                          selectContact(contact.id)
                        }
                        style={[
                          styles.contactChip,
                          active &&
                            styles.contactChipActive,
                        ]}>
                        <View
                          style={[
                            styles.contactAvatar,
                            active &&
                              styles.contactAvatarActive,
                          ]}>
                          <Text
                            style={[
                              styles.contactAvatarText,
                              active &&
                                styles.contactAvatarTextActive,
                            ]}>
                            {contact.initials}
                          </Text>
                        </View>

                        <Text
                          style={[
                            styles.contactName,
                            active &&
                              styles.contactNameActive,
                          ]}
                          numberOfLines={1}>
                          {contact.name}
                        </Text>

                        <Text
                          style={styles.contactRole}
                          numberOfLines={1}>
                          {contact.role}
                        </Text>
                      </Pressable>
                    );
                  })
                ) : (
                  <Text style={styles.emptyContacts}>
                    {loading
                      ? 'Loading contacts...'
                      : 'No available contacts.'}
                  </Text>
                )}
              </ScrollView>
            </View>
          )}

          {activeContact ? (
            <View
              style={[
                styles.conversation,
                keyboardVisible &&
                  styles.conversationKeyboard,
              ]}>
              <View style={styles.conversationHeader}>
                <View style={styles.conversationAvatar}>
                  <Text style={styles.conversationAvatarText}>
                    {activeContact.initials}
                  </Text>
                </View>

                <View style={styles.conversationCopy}>
                  <Text style={styles.conversationName}>
                    {activeContact.name}
                  </Text>

                  <Text style={styles.conversationRole}>
                    {activeContact.role}
                  </Text>
                </View>

                <View style={styles.onlineWrap}>
                  <View style={styles.onlineDot} />
                </View>
              </View>

              <FlatList
                ref={messageListRef}
                data={activeContact.messages}
                keyExtractor={(item) =>
                  String(item.id)
                }
                style={styles.messages}
                contentContainerStyle={styles.messageContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="interactive"
                ListEmptyComponent={
                  <View style={styles.emptyConversation}>
                    <Text style={styles.emptyConversationTitle}>
                      {messagesLoading
                        ? 'Loading messages...'
                        : 'No messages yet'}
                    </Text>

                    {!messagesLoading && (
                      <Text style={styles.emptyConversationText}>
                        Your conversation history will appear here.
                      </Text>
                    )}
                  </View>
                }
                renderItem={({ item }) => {
                  const mine =
                    role === 'driver'
                      ? item.senderType === 'driver'
                      : item.senderType === 'client';

                  return (
                    <View
                      style={[
                        styles.messageBlock,
                        mine &&
                          styles.messageBlockMine,
                      ]}>
                      <View
                        style={[
                          styles.messageBubble,
                          mine &&
                            styles.messageBubbleMine,
                        ]}>
                        <Text
                          style={[
                            styles.messageText,
                            mine &&
                              styles.messageTextMine,
                          ]}>
                          {item.body}
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.messageTime,
                          mine &&
                            styles.messageTimeMine,
                        ]}>
                        {formatMessageTime(
                          item.createdAt,
                        )}
                      </Text>
                    </View>
                  );
                }}
                onContentSizeChange={() =>
                  messageListRef.current?.scrollToEnd({
                    animated: false,
                  })
                }
              />

              <View style={styles.compose}>
                <View style={styles.composeRow}>
                  <Pressable
                    style={styles.attachButton}
                    onPress={handleAttachment}
                    accessibilityRole="button"
                    accessibilityLabel="Attach file">
                    <Text style={styles.attachText}>＋</Text>
                  </Pressable>

                  <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Write a private message..."
                    placeholderTextColor={DriverColors.muted}
                    multiline
                    style={styles.messageInput}
                    textAlignVertical="top"
                    scrollEnabled
                    returnKeyType="default"
                    editable={!sending}
                    onFocus={() => {
                      setTimeout(() => {
                        messageListRef.current?.scrollToEnd({
                          animated: true,
                        });
                      }, 250);
                    }}
                    onContentSizeChange={() => {
                      setTimeout(() => {
                        messageListRef.current?.scrollToEnd({
                          animated: true,
                        });
                      }, 50);
                    }}
                    onSubmitEditing={(event) => {
                      if (Platform.OS === 'ios') {
                        return;
                      }

                      event.preventDefault();
                      sendMessage();
                    }}
                  />

                  <Pressable
                    style={[
                      styles.sendButton,
                      (!message.trim() || sending) &&
                        styles.sendButtonDisabled,
                    ]}
                    onPress={sendMessage}
                    disabled={
                      !message.trim() || sending
                    }
                    accessibilityRole="button"
                    accessibilityLabel="Send message">
                    <Text style={styles.sendText}>
                      {sending ? '…' : '➤'}
                    </Text>
                  </Pressable>
                </View>

                <Text style={styles.privateNote}>
                  Private messages are shared only with
                  selected participants.
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.noConversation}>
              <Text style={styles.noConversationTitle}>
                No active conversation
              </Text>

              <Text style={styles.noConversationText}>
                There are no available participants for your
                current trip.
              </Text>
            </View>
          )}
        </View>
      </View>

      <AppDialog
        visible={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        confirmLabel="OK"
        onConfirm={closeDialog}
        onCancel={closeDialog}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: DriverColors.ivory,
  },

  chatHeader: {
    paddingHorizontal: 16,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DriverColors.green,
  },

  backButton: {
  width: 38,
  height: 38,
  borderRadius: 11,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.27)',
  backgroundColor: 'rgba(255,255,255,0.07)',
  alignItems: 'center',
  justifyContent: 'center',
},


  chatHeaderCopy: {
    flex: 1,
    marginLeft: 11,
  },

  chatHeaderEyebrow: {
    color: '#ddcfaf',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.35,
    marginBottom: 1,
  },

  chatHeaderTitle: {
    color: '#FFFFFF',
    fontFamily: 'Georgia',
    fontSize: 19,
    fontWeight: '900',
    lineHeight: 23,
  },

  body: {
    flex: 1,
    minHeight: 0,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 8,
  },

  contactTools: {
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#e4d8c1',
    borderRadius: 20,
    padding: 10,
  },

  searchInput: {
    width: '100%',
    height: 42,
    borderWidth: 1,
    borderColor: DriverColors.line,
    borderRadius: 12,
    paddingHorizontal: 13,
    backgroundColor: '#f8f5ee',
    color: DriverColors.ink,
    fontSize: 13,
  },

  contactList: {
    gap: 9,
    paddingTop: 9,
  },

  contactChip: {
    width: 132,
    minHeight: 88,
    padding: 9,
    borderWidth: 1,
    borderColor: DriverColors.line,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },

  contactChipActive: {
    backgroundColor: '#edf3ee',
    borderColor: '#9eb8a7',
  },

  contactAvatar: {
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: '#e6dcc1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },

  contactAvatarActive: {
    backgroundColor: '#dfe9e2',
  },

  contactAvatarText: {
    color: '#6d5223',
    fontFamily: 'Georgia',
    fontSize: 11,
    fontWeight: '700',
  },

  contactAvatarTextActive: {
    color: DriverColors.green,
  },

  contactName: {
    color: DriverColors.ink,
    fontSize: 12,
    fontWeight: '700',
  },

  contactNameActive: {
    color: DriverColors.green,
  },

  contactRole: {
    color: DriverColors.muted,
    fontSize: 9,
    marginTop: 3,
  },

  emptyContacts: {
    paddingVertical: 12,
    color: DriverColors.muted,
    fontSize: 11,
  },

  conversation: {
    flex: 1,
    minHeight: 0,
    marginTop: 8,
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: DriverColors.line,
    borderRadius: 22,
    overflow: 'hidden',
  },

  conversationKeyboard: {
    marginTop: 0,
  },

  conversationHeader: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: DriverColors.line,
    flexDirection: 'row',
    alignItems: 'center',
  },

  conversationAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#dfe9e2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  conversationAvatarText: {
    color: DriverColors.green,
    fontFamily: 'Georgia',
    fontSize: 11,
    fontWeight: '700',
  },

  conversationCopy: {
    flex: 1,
    marginLeft: 10,
  },

  conversationName: {
    color: DriverColors.ink,
    fontSize: 13,
    fontWeight: '700',
  },

  conversationRole: {
    color: DriverColors.muted,
    fontSize: 10,
    marginTop: 2,
  },

  onlineWrap: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#68a85f',
    borderWidth: 3,
    borderColor: '#e5f1e2',
  },

  messages: {
    flex: 1,
    minHeight: 0,
    backgroundColor: '#fffdf8',
  },

  messageContent: {
    padding: 16,
    paddingBottom: 20,
    flexGrow: 1,
  },

  emptyConversation: {
    flex: 1,
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  emptyConversationTitle: {
    color: DriverColors.ink,
    fontFamily: 'Georgia',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },

  emptyConversationText: {
    color: DriverColors.muted,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 6,
  },

  messageBlock: {
    maxWidth: '79%',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },

  messageBlockMine: {
    alignSelf: 'flex-end',
  },

  messageBubble: {
    backgroundColor: '#edf1eb',
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: 15,
    borderBottomLeftRadius: 4,
  },

  messageBubbleMine: {
    backgroundColor: DriverColors.green,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 4,
  },

  messageText: {
    color: '#26352e',
    fontFamily: 'Georgia',
    fontSize: 13,
    lineHeight: 19,
  },

  messageTextMine: {
    color: '#FFFFFF',
  },

  messageTime: {
    color: DriverColors.muted,
    fontSize: 9,
    marginTop: 4,
  },

  messageTimeMine: {
    textAlign: 'right',
  },

  compose: {
    borderTopWidth: 1,
    borderTopColor: DriverColors.line,
    paddingHorizontal: 11,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },

  composeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },

  attachButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cad8ce',
    backgroundColor: '#edf3ee',
    alignItems: 'center',
    justifyContent: 'center',
  },

  attachText: {
    color: DriverColors.green,
    fontSize: 20,
  },

  messageInput: {
    flex: 1,
    minHeight: 42,
    maxHeight: 95,
    borderWidth: 1,
    borderColor: DriverColors.line,
    borderRadius: 13,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: DriverColors.ink,
    fontSize: 13,
    backgroundColor: '#FFFFFF',
  },

  sendButton: {
    width: 44,
    height: 42,
    borderRadius: 12,
    backgroundColor: DriverColors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sendButtonDisabled: {
    opacity: 0.45,
  },

  sendText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  privateNote: {
    color: DriverColors.muted,
    fontSize: 10,
    paddingTop: 4,
    paddingLeft: 50,
  },

  noConversation: {
    flex: 1,
    marginTop: 8,
    borderWidth: 1,
    borderColor: DriverColors.line,
    borderRadius: 22,
    backgroundColor: '#FFFDF8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  noConversationTitle: {
    color: DriverColors.ink,
    fontFamily: 'Georgia',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },

  noConversationText: {
    color: DriverColors.muted,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 7,
  },
});