import { useMemo, useState } from 'react';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandHeader } from '@/components/brand-header';
import { Layout, Palette, Spacing } from '@/constants/theme';
import type { Update } from '@/constants/mock-data';

type AppHeaderProps = {
  updates: Update[];
  avatarUri?: string | null;
  onAvatarPress?: () => void;
  onNotificationPress?: (updateId: number) => void;
};

export function AppHeader({
  updates,
  avatarUri,
  onAvatarPress,
  onNotificationPress,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const [panelOpen, setPanelOpen] = useState(false);

  const unreadCount = useMemo(() => updates.filter((item) => item.unread).length, [updates]);

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <BrandHeader compact />
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${unreadCount} unread notifications`}
            onPress={() => setPanelOpen((open) => !open)}
            style={({ pressed }) => [styles.bell, pressed && styles.pressed]}>
            <Text style={styles.bellIcon}>●</Text>
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Profile"
            onPress={onAvatarPress}
            style={({ pressed }) => [styles.avatarButton, pressed && styles.pressed]}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} contentFit="cover" />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarPlaceholderText}>+</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      {panelOpen && (
        <View style={styles.panel}>
          <View style={styles.panelHead}>
            <Text style={styles.panelTitle}>Notifications</Text>
            <Text style={styles.panelCount}>{unreadCount} unread</Text>
          </View>
          {updates.slice(0, 3).map((update) => (
            <Pressable
              key={update.id}
              accessibilityRole="button"
              onPress={() => {
                onNotificationPress?.(update.id);
                setPanelOpen(false);
              }}
              style={[styles.panelItem, update.unread && styles.panelItemUnread]}>
              <View style={[styles.dot, update.unread && styles.dotUnread]} />
              <View style={styles.panelItemContent}>
                <Text style={styles.panelItemKind}>{update.kind}</Text>
                <Text style={styles.panelItemMessage}>{update.message}</Text>
                <Text style={styles.panelItemTime}>{update.time}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Palette.paper,
    borderBottomWidth: 1,
    borderBottomColor: Palette.line,
    zIndex: 10,
  },
  header: {
    height: Layout.headerHeight,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bell: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellIcon: {
    fontSize: 15,
    color: Palette.green,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Palette.gold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: Palette.white,
  },
  avatarButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Palette.line,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    flex: 1,
    backgroundColor: Palette.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholderText: {
    fontSize: 16,
    color: Palette.green,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
  panel: {
    position: 'absolute',
    top: Layout.headerHeight + 8,
    right: 12,
    width: 300,
    maxWidth: '92%',
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.line,
    shadowColor: '#0E3024',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
    zIndex: 20,
  },
  panelHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Palette.line,
  },
  panelTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.ink,
  },
  panelCount: {
    fontSize: 9,
    color: Palette.muted,
  },
  panelItem: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Palette.line,
  },
  panelItemUnread: {
    backgroundColor: '#F8F8F2',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D6D2C8',
    marginTop: 6,
  },
  dotUnread: {
    backgroundColor: Palette.gold,
  },
  panelItemContent: {
    flex: 1,
    gap: 3,
  },
  panelItemKind: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.ink,
  },
  panelItemMessage: {
    fontSize: 10,
    color: Palette.muted,
    lineHeight: 14,
  },
  panelItemTime: {
    fontSize: 8,
    color: Palette.muted,
  },
});
