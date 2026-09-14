import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import '@/global.css';

import { AuthProvider, useAuth } from '@/context/auth-context';
import { DrawerProvider } from '@/context/drawer-context';
import { Palette } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

const LightNavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Palette.cream,
    card: Palette.paper,
    text: Palette.ink,
    border: Palette.line,
    primary: Palette.green,
  },
};

const DarkNavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Palette.forest,
    card: Palette.green,
    text: Palette.cream,
    border: '#2E4A3D',
    primary: Palette.lime,
  },
};

function RootNavigator() {
  const { isAuthenticated, isBootstrapping } = useAuth();

  useEffect(() => {
    if (!isBootstrapping) {
      SplashScreen.hideAsync();
    }
  }, [isBootstrapping]);

  if (isBootstrapping) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
      </Stack.Protected>

      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="welcome" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(client)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(support)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(admin)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(fts)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(driver)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(host)" options={{ gestureEnabled: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <DrawerProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkNavigationTheme : LightNavigationTheme}>
          <RootNavigator />
        </ThemeProvider>
      </DrawerProvider>
    </AuthProvider>
  );
}
