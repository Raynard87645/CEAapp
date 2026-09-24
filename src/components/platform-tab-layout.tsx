import { Tabs, useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CalendarIcon } from '@/components/icons/calendar-icon';
import { ChatIcon } from '@/components/icons/chat-icon';
import type { AppRole, PlatformTab } from '@/constants/platforms';
import { getPlatformHomeRoute } from '@/constants/platforms';
import { Layout, Palette } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { resetToLanding } from '@/lib/navigation';

type DesignTabBarProps = {
  state: { index: number; routes: Array<{ key: string; name: string }> };
  descriptors: Record<string, { options?: { title?: string } }>;
  navigation: { navigate: (name: string) => void };
  tabs: PlatformTab[];
};

function DesignTabBar({ state, descriptors, navigation, tabs }: DesignTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const tab = tabs.find((item) => item.name === route.name);
        const label = tab?.label ?? descriptors[route.key]?.options?.title ?? route.name;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            onPress={() => navigation.navigate(route.name)}
            style={styles.tabButton}>
            {tab?.icon === 'calendar' ? (
              <CalendarIcon
                size={focused ? 22 : 21}
                color={focused ? Palette.green : Palette.muted}
              />
            ) : tab?.icon === 'chat' ? (
              <ChatIcon
                size={focused ? 22 : 21}
                color={focused ? Palette.green : Palette.muted}
              />
            ) : (
              <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
                {tab?.icon ?? '•'}
              </Text>
            )}
            <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
            {focused ? <View style={styles.activeDash} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

type PlatformTabLayoutProps = {
  allowedRoles: AppRole[];
  tabs?: PlatformTab[];
  resolveTabs?: (role: AppRole | null) => PlatformTab[];
};

export function PlatformTabLayout({ allowedRoles, tabs, resolveTabs }: PlatformTabLayoutProps) {
  const router = useRouter();
  const { role, isAuthenticated, isBootstrapping, hasCompletedWelcome } = useAuth();

  const activeTabs = useMemo(
    () => (resolveTabs ? resolveTabs(role) : tabs ?? []),
    [resolveTabs, role, tabs],
  );

  useEffect(() => {
    if (isBootstrapping) return;

    if (!isAuthenticated) {
      resetToLanding();
      return;
    }

    if (!hasCompletedWelcome) {
      router.replace('/welcome');
      return;
    }

    if (role && !allowedRoles.includes(role)) {
      router.replace(getPlatformHomeRoute(role));
    }
  }, [allowedRoles, hasCompletedWelcome, isAuthenticated, isBootstrapping, role, router]);

  return (
    <Tabs
      tabBar={(props) => <DesignTabBar {...props} tabs={activeTabs} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: Palette.cream },
      }}>
      {activeTabs.map((tab) => (
        <Tabs.Screen key={tab.name} name={tab.name} options={{ title: tab.title }} />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Palette.paper,
    borderTopWidth: 1,
    borderTopColor: Palette.line,
    minHeight: Layout.bottomNavHeight,
    ...Platform.select({
      ios: {
        shadowColor: '#0E3024',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: -4 },
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 6,
    gap: 4,
  },
  tabIcon: {
    fontSize: 18,
    fontWeight: '600',
    color: Palette.muted,
  },
  tabIconFocused: {
    color: Palette.green,
    fontSize: 19,
    fontWeight: '900',
  },
  tabLabel: {
    fontSize: 8,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: Palette.muted,
    fontWeight: '600',
  },
  tabLabelFocused: {
    color: Palette.green,
    fontSize: 9,
    fontWeight: '900',
  },
  activeDash: {
    width: 28,
    height: 3,
    borderRadius: 2,
    backgroundColor: Palette.green,
    marginTop: 2,
  },
});
