import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import '@/global.css';

import { AuthProvider } from '@/context/auth-context';
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

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkNavigationTheme : LightNavigationTheme}>
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="welcome" options={{ gestureEnabled: false }} />
          <Stack.Screen name="(client)" options={{ gestureEnabled: false }} />
          <Stack.Screen name="(support)" options={{ gestureEnabled: false }} />
          <Stack.Screen name="(admin)" options={{ gestureEnabled: false }} />
          <Stack.Screen name="(fts)" options={{ gestureEnabled: false }} />
          <Stack.Screen name="(driver)" options={{ gestureEnabled: false }} />
          <Stack.Screen name="(host)" options={{ gestureEnabled: false }} />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
