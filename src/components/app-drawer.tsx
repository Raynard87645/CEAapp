import { router, useSegments } from 'expo-router';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandHeader } from '@/components/brand-header';
import { getDrawerLinksForRole, getPlatformConfig } from '@/constants/platforms';
import { Fonts, Palette, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { isDrawerLinkActive } from '@/lib/navigation';

type AppDrawerProps = {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
};

export function AppDrawer({ visible, onClose, onLogout }: AppDrawerProps) {
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const { fullName, firstName, roleLabel, platformLabel, bookingId, role } = useAuth();

  const displayName = fullName || firstName || 'Guest';
  const platform = getPlatformConfig(role);
  const links = getDrawerLinksForRole(role);

  const handleNavigate = (href: string) => {
    onClose();
    router.push(href as never);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close menu"
          onPress={onClose}
          style={styles.backdrop}
        />

        <View
          style={[
            styles.panel,
            {
              paddingTop: insets.top + Spacing.three,
              paddingBottom: Math.max(insets.bottom, Spacing.three),
            },
          ]}>
          <BrandHeader compact style={styles.brand} />

          <View style={styles.profile}>
            <Text style={styles.profileLabel}>Signed in as</Text>
            <Text style={styles.profileName}>{displayName}</Text>
            <Text style={styles.profileMeta}>
              {roleLabel}
              {platformLabel ? ` · ${platformLabel}` : ''}
            </Text>
            {bookingId ? <Text style={styles.bookingRef}>Booking #{bookingId}</Text> : null}
          </View>

          {links.length > 0 ? (
            <View style={styles.navSection}>
              <Text style={styles.navEyebrow}>{platform?.eyebrow ?? 'Menu'}</Text>
              <ScrollView showsVerticalScrollIndicator={false} style={styles.navList}>
                {links.map((link) => {
                  const active = isDrawerLinkActive(link.tabName, segments);

                  return (
                    <Pressable
                      key={link.href}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                      onPress={() => handleNavigate(link.href)}
                      style={({ pressed }) => [
                        styles.navItem,
                        active && styles.navItemActive,
                        pressed && styles.pressed,
                      ]}>
                      <Text style={[styles.navIcon, active && styles.navIconActive]}>{link.icon}</Text>
                      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{link.label}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          ) : null}

          <Pressable
            accessibilityRole="button"
            onPress={onLogout}
            style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}>
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(14,33,27,0.45)',
  },
  panel: {
    flex: 1,
    width: 300,
    maxWidth: '84%',
    backgroundColor: Palette.paper,
    borderRightWidth: 1,
    borderRightColor: Palette.line,
    paddingHorizontal: 22,
    gap: Spacing.four,
  },
  brand: {
    marginBottom: Spacing.two,
  },
  profile: {
    gap: 6,
    paddingBottom: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: Palette.line,
  },
  profileLabel: {
    fontSize: 8,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Palette.muted,
    fontWeight: '700',
  },
  profileName: {
    fontFamily: Fonts.serif,
    fontSize: 24,
    color: Palette.ink,
  },
  profileMeta: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.green,
  },
  bookingRef: {
    fontSize: 10,
    color: Palette.muted,
    marginTop: 4,
  },
  navSection: {
    flex: 1,
    gap: 10,
    minHeight: 0,
  },
  navEyebrow: {
    fontSize: 8,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: Palette.muted,
    fontWeight: '800',
  },
  navList: {
    flex: 1,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Palette.line,
  },
  navItemActive: {
    backgroundColor: '#F4F7F4',
    marginHorizontal: -4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderBottomColor: 'transparent',
  },
  navIcon: {
    width: 22,
    textAlign: 'center',
    fontSize: 16,
    color: Palette.muted,
  },
  navIconActive: {
    color: Palette.green,
  },
  navLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: Palette.ink,
  },
  navLabelActive: {
    color: Palette.green,
    fontWeight: '800',
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: Palette.line,
    backgroundColor: Palette.white,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Palette.green,
  },
  pressed: {
    opacity: 0.75,
  },
});
