import { Tabs, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { JourneyProvider } from '@/context/journey-context';
import { Layout, Palette } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';

const TAB_ITEMS = [
  { name: 'index', label: 'Home', icon: '⌂' },
  { name: 'itinerary', label: 'Itinerary', icon: '▤' },
  { name: 'addons', label: 'Add-ons', icon: '+' },
  { name: 'messages', label: 'Messages', icon: '□' },
  { name: 'updates', label: 'Updates', icon: '≡' },
] as const;

function ClientTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {state.routes.map((route: any, index: number) => {
        const focused = state.index === index;
        const tab = TAB_ITEMS.find((item) => item.name === route.name);
        const label = tab?.label ?? descriptors[route.key]?.options?.title ?? route.name;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            onPress={() => navigation.navigate(route.name)}
            style={styles.tabButton}>
            <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
              {tab?.icon ?? '•'}
            </Text>
            <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function ClientLayout() {
  const router = useRouter();
  const { isAuthenticated, hasCompletedWelcome, role } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/');
      return;
    }
    if (!hasCompletedWelcome) {
      router.replace('/welcome');
      return;
    }
    if (role === 'host') {
      router.replace('/(host)');
    }
  }, [isAuthenticated, hasCompletedWelcome, role, router]);

  return (
    <JourneyProvider>
      <Tabs
        tabBar={(props) => <ClientTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: Palette.cream },
        }}>
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="itinerary" options={{ title: 'Itinerary' }} />
        <Tabs.Screen name="addons" options={{ title: 'Add-ons' }} />
        <Tabs.Screen name="messages" options={{ title: 'Messages' }} />
        <Tabs.Screen name="updates" options={{ title: 'Updates' }} />
      </Tabs>
    </JourneyProvider>
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
    gap: 4,
  },
  tabIcon: {
    fontSize: 18,
    color: Palette.muted,
  },
  tabIconFocused: {
    color: Palette.green,
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
    fontWeight: '800',
  },
});
