import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts, Palette } from '@/constants/theme';

type AppDialogProps = {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel: () => void;
};

export function AppDialog({
  visible,
  title,
  message,
  confirmLabel = 'OK',
  cancelLabel,
  onConfirm,
  onCancel,
}: AppDialogProps) {
  function handleConfirm() {
    onConfirm?.();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.accent} />

          <Text style={styles.title}>{title}</Text>

          {message ? (
            <Text style={styles.message}>{message}</Text>
          ) : null}

          <View style={styles.actions}>
            {cancelLabel ? (
              <Pressable
                style={({ pressed }) => [
                  styles.cancelButton,
                  pressed && styles.pressed,
                ]}
                onPress={onCancel}>
                <Text style={styles.cancelText}>
                  {cancelLabel}
                </Text>
              </Pressable>
            ) : null}

            <Pressable
              style={({ pressed }) => [
                styles.confirmButton,
                pressed && styles.pressed,
              ]}
              onPress={handleConfirm}>
              <Text style={styles.confirmText}>
                {confirmLabel}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 44, 34, 0.42)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },

  dialog: {
    width: '100%',
    maxWidth: 390,
    backgroundColor: Palette.paper,
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 18,
    borderWidth: 1,
    borderColor: Palette.line,
    overflow: 'hidden',
  },

  accent: {
    position: 'absolute',
    top: 0,
    left: 22,
    right: 22,
    height: 3,
    backgroundColor: Palette.gold,
  },

  title: {
    fontFamily: Fonts.serif,
    fontSize: 23,
    lineHeight: 28,
    color: Palette.green,
    fontWeight: '400',
  },

  message: {
    marginTop: 10,
    color: Palette.muted,
    fontSize: 14,
    lineHeight: 21,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    marginTop: 22,
  },

  cancelButton: {
    minHeight: 42,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Palette.line,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelText: {
    color: Palette.green,
    fontSize: 13,
    fontWeight: '700',
  },

  confirmButton: {
    minHeight: 42,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: Palette.green,
    alignItems: 'center',
    justifyContent: 'center',
  },

  confirmText: {
    color: Palette.white,
    fontSize: 13,
    fontWeight: '700',
  },

  pressed: {
    opacity: 0.72,
  },
});