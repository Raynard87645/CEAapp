import { ReactNode, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DrawerMenuButton } from '@/components/drawer-menu-button';
import { Card, Pill } from '@/components/driver/ui';
import { DriverColors } from '@/constants/driver-colors';
import { useAuth } from '@/context/auth-context';
import { useDriver } from '@/context/driver-context';

export function DriverTopBar() {
  const insets = useSafeAreaInsets();
  const { fullName, firstName } = useAuth();
  const { dashboard } = useDriver();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const displayName = fullName || firstName || dashboard?.driver.name || 'Driver';
  const notifications = dashboard?.notifications ?? [];
  const unreadCount = dashboard?.unreadCount ?? notifications.length;

  return (
    <>
      <View style={[styles.wrap, { paddingTop: insets.top + 8 }]}>
        <DrawerMenuButton />
        <View style={styles.brand}>
          <View style={styles.mark}>
            <Text style={styles.markText}>TJ</Text>
          </View>
          <View style={styles.brandCopy}>
            <Text style={styles.brandTitle}>Tour Jamaica</Text>
            <Text style={styles.brandSub} numberOfLines={1}>
              {displayName}
              {dashboard?.driver.status ? ` · ${dashboard.driver.status}` : ''}
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.notificationBtn}
          onPress={() => setNotificationsOpen(true)}
          accessibilityLabel="Open notifications">
          <Text style={styles.notificationIcon}>🔔</Text>
          {unreadCount > 0 ? (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </Text>
            </View>
          ) : null}
        </Pressable>

        <Image
          source={{
            uri:
              dashboard?.driver.avatar ??
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="90" height="90"%3E%3Crect width="90" height="90" rx="45" fill="%23dbe3dc"/%3E%3Ccircle cx="45" cy="34" r="15" fill="%23859b8c"/%3E%3Cpath d="M18 82c3-20 14-30 27-30s24 10 27 30" fill="%23859b8c"/%3E%3C/svg%3E',
          }}
          style={styles.avatar}
        />
      </View>

      <Modal
        visible={notificationsOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setNotificationsOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.modalHead}>
              <Text style={styles.modalTitle}>FTS Notifications</Text>
              <Pressable onPress={() => setNotificationsOpen(false)}>
                <Text style={styles.modalClose}>Close</Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {notifications.length ? (
                notifications.map((notification) => (
                  <Card key={notification.id}>
                    <View style={styles.notificationRow}>
                      {notification.tag ? <Pill tone="gold">{notification.tag}</Pill> : null}
                      <Text style={styles.notificationMessage}>{notification.message}</Text>
                    </View>
                  </Card>
                ))
              ) : (
                <Card>
                  <Text style={styles.emptyNotifications}>No FTS notifications right now.</Text>
                </Card>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

export function DriverScreenShell({ children }: { children: ReactNode }) {
  return (
    <View style={styles.screen}>
      <DriverTopBar />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: DriverColors.ivory,
  },
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 11,
    borderBottomWidth: 1,
    borderBottomColor: DriverColors.line,
    backgroundColor: 'rgba(248,244,234,0.96)',
    gap: 4,
  },
  brand: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    minWidth: 0,
  },
  brandCopy: {
    flex: 1,
    minWidth: 0,
  },
  mark: {
    width: 39,
    height: 39,
    borderRadius: 19.5,
    backgroundColor: DriverColors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: {
    color: '#d7bd79',
    fontWeight: '700',
    fontSize: 13,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DriverColors.ink,
  },
  brandSub: {
    color: DriverColors.muted,
    fontSize: 12,
  },
  notificationBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationIcon: {
    fontSize: 18,
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 0,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: DriverColors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#d8dfda',
    borderWidth: 2,
    borderColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    maxHeight: '70%',
    backgroundColor: DriverColors.ivory,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  modalHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: DriverColors.ink,
  },
  modalClose: {
    color: DriverColors.green,
    fontWeight: '700',
  },
  notificationRow: {
    gap: 8,
  },
  notificationMessage: {
    color: DriverColors.ink,
    fontSize: 14,
    lineHeight: 20,
  },
  emptyNotifications: {
    color: DriverColors.muted,
    fontSize: 14,
  },
});
