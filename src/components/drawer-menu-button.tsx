import { Pressable, StyleSheet, Text } from 'react-native';

import { Palette } from '@/constants/theme';
import { useDrawer } from '@/context/drawer-context';

type DrawerMenuButtonProps = {
  light?: boolean;
};

export function DrawerMenuButton({ light = false }: DrawerMenuButtonProps) {
  const { openDrawer } = useDrawer();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Open menu"
      onPress={openDrawer}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Text style={[styles.icon, light && styles.iconLight]}>☰</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
    color: Palette.green,
    fontWeight: '700',
  },
  iconLight: {
    color: Palette.white,
  },
  pressed: {
    opacity: 0.7,
  },
});
