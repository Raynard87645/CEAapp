import { Tabs, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DriverColors } from '@/constants/driver-colors';
import type { PlatformTab } from '@/constants/platforms';
import { getPlatformHomeRoute } from '@/constants/platforms';
import { useAuth } from '@/context/auth-context';
import { resetToLanding } from '@/lib/navigation';

type DriverTabBarProps = {
  state: { index: number; routes: Array<{ key: string; name: string }> };
  descriptors: Record<string, { options?: { title?: string } }>;
  navigation: { navigate: (name: string) => void };
  tabs: PlatformTab[];
};

function DriverTabBar({ state, descriptors, navigation, tabs }: DriverTabBarProps) {
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
            <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>{tab?.icon ?? '•'}</Text>
            <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
            {focused ? <View style={styles.activeDash} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

type DriverTabLayoutProps = {
  tabs: PlatformTab[];
};

export function DriverTabLayout({ tabs }: DriverTabLayoutProps) {
  const router = useRouter();
  const { role, isAuthenticated, isBootstrapping, hasCompletedWelcome } = useAuth();

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

    if (role && role !== 'driver') {
      router.replace(getPlatformHomeRoute(role));
    }
  }, [hasCompletedWelcome, isAuthenticated, isBootstrapping, role, router]);

  return (
    <Tabs
      tabBar={(props) => <DriverTabBar {...props} tabs={tabs} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: DriverColors.ivory },
      }}>
      {tabs.map((tab) => (
        <Tabs.Screen key={tab.name} name={tab.name} options={{ title: tab.title }} />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,253,248,0.97)',
    borderTopWidth: 1,
    borderTopColor: DriverColors.line,
    minHeight: Platform.OS === 'ios' ? 84 : 72,
    paddingTop: 6,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 6,
    gap: 2,
  },
  tabIcon: {
    fontSize: 20,
    fontWeight: '600',
    color: '#858b87',
    marginBottom: 2,
  },
  tabIconFocused: {
    color: DriverColors.green,
    fontSize: 21,
    fontWeight: '900',
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#858b87',
  },
  tabLabelFocused: {
    color: DriverColors.green,
    fontSize: 10,
    fontWeight: '900',
  },
  activeDash: {
    width: 28,
    height: 3,
    borderRadius: 2,
    backgroundColor: DriverColors.green,
    marginTop: 2,
  },
});
