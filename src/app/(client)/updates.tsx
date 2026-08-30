import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { EyebrowText, SerifTitle } from '@/components/ui/typography';
import { Fonts, Layout, Palette, Spacing } from '@/constants/theme';
import { useJourney } from '@/context/journey-context';

export default function UpdatesScreen() {
  const { updates, highlightId, avatarUri, markRead, pickAvatar } = useJourney();

  return (
    <View style={styles.screen}>
      <AppHeader updates={updates} avatarUri={avatarUri} onAvatarPress={pickAvatar} onNotificationPress={markRead} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.head}>
          <EyebrowText>JOURNEY INBOX</EyebrowText>
          <SerifTitle size="page">
            Your <Text style={styles.accent}>updates</Text>
          </SerifTitle>
          <Text style={styles.subtitle}>
            Relevant service messages from your Tour Jamaica team.
          </Text>
        </View>

        <View style={styles.list}>
          {updates.map((update) => (
            <View
              key={update.id}
              style={[
                styles.item,
                update.unread && styles.itemUnread,
                highlightId === update.id && styles.itemHighlight,
              ]}>
              <View style={[styles.dot, update.unread && styles.dotUnread]} />
              <View style={styles.itemContent}>
                <View style={styles.itemTop}>
                  <Text style={styles.itemFromLabel}>FROM</Text>
                  <Text style={styles.itemTime}>{update.time}</Text>
                </View>
                <Text style={styles.itemFrom}>{update.from}</Text>
                <Text style={styles.itemKind}>{update.kind}</Text>
                <Text style={styles.itemMessage}>{update.message}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
  list: {
    gap: 9,
  },
  item: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.line,
    padding: 20,
  },
  itemUnread: {
    borderLeftWidth: 3,
    borderLeftColor: Palette.gold,
    backgroundColor: '#F8F8F2',
  },
  itemHighlight: {
    shadowColor: Palette.gold,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D6D2C8',
    marginTop: 4,
  },
  dotUnread: {
    backgroundColor: Palette.gold,
  },
  itemContent: {
    flex: 1,
    gap: 4,
  },
  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemFromLabel: {
    fontSize: 7,
    letterSpacing: 1.2,
    color: Palette.muted,
    fontWeight: '700',
  },
  itemTime: {
    fontSize: 7,
    color: Palette.muted,
  },
  itemFrom: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    color: Palette.ink,
  },
  itemKind: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.green,
  },
  itemMessage: {
    fontSize: 11,
    color: '#59655E',
    lineHeight: 16,
  },
});
