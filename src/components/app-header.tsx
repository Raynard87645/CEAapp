import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandHeader } from '@/components/brand-header';
import { DrawerMenuButton } from '@/components/drawer-menu-button';
import { ChatIcon } from '@/components/icons/chat-icon';
import { Layout, Palette } from '@/constants/theme';

type AppHeaderProps = {
  avatarUri?: string | null;
  onAvatarPress?: () => void;
};

export function AppHeader({ avatarUri, onAvatarPress }: AppHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.leading}>
          <DrawerMenuButton />
          <BrandHeader compact />
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open messages"
            onPress={() => router.push('/messagesScreen')}
            style={({ pressed }) => [
              styles.messageButton,
              pressed && styles.pressed,
            ]}>
            <ChatIcon
              size={21}
              color={Palette.green}
            />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Profile"
            onPress={onAvatarPress}
            style={({ pressed }) => [
              styles.avatarButton,
              pressed && styles.pressed,
            ]}>
            {avatarUri ? (
              <Image
                source={{ uri: avatarUri }}
                style={styles.avatarImage}
                contentFit="cover"
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarPlaceholderText}>+</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>
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
    gap: 8,
  },
  leading: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 0,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  messageButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
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
});