import { ReactNode } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DrawerMenuButton } from '@/components/drawer-menu-button';
import { DriverColors } from '@/constants/driver-colors';
import { useAuth } from '@/context/auth-context';
import { useDriver } from '@/context/driver-context';

export function DriverTopBar() {
  const insets = useSafeAreaInsets();
  const { fullName, firstName } = useAuth();
  const { dashboard } = useDriver();

  const displayName = fullName || firstName || dashboard?.driver.name || 'Driver';

  return (
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
          </Text>
        </View>
      </View>
      <Image
        source={{
          uri:
            dashboard?.driver.avatar ??
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="90" height="90"%3E%3Crect width="90" height="90" rx="45" fill="%23dbe3dc"/%3E%3Ccircle cx="45" cy="34" r="15" fill="%23859b8c"/%3E%3Cpath d="M18 82c3-20 14-30 27-30s24 10 27 30" fill="%23859b8c"/%3E%3C/svg%3E',
        }}
        style={styles.avatar}
      />
    </View>
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
});
