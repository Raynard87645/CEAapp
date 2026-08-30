import { ActivityIndicator, Pressable, StyleSheet, Text, type PressableProps } from 'react-native';

import { Fonts, Layout, Palette, Spacing } from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'landing';

type AppButtonProps = PressableProps & {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
};

export function AppButton({
  label,
  variant = 'primary',
  loading = false,
  fullWidth = false,
  disabled,
  style,
  ...rest
}: AppButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed, hovered }) => [
        styles.base,
        styles[variant],
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        typeof style === 'function' ? style({ pressed, hovered }) : style,
      ]}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={variant === 'landing' ? Palette.green : Palette.white} />
      ) : (
        <Text style={[styles.label, styles[`${variant}Label` as keyof typeof styles]]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Layout.borderRadius.sm,
    paddingVertical: 14,
    paddingHorizontal: 18,
    minHeight: 48,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  primary: {
    backgroundColor: Palette.green,
  },
  secondary: {
    backgroundColor: Palette.sage,
  },
  outline: {
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.line,
  },
  landing: {
    backgroundColor: Palette.lime,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    width: 220,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
  },
  primaryLabel: {
    color: Palette.white,
  },
  secondaryLabel: {
    color: Palette.green,
  },
  outlineLabel: {
    color: Palette.green,
    fontSize: 11,
    fontWeight: '700',
  },
  landingLabel: {
    color: Palette.green,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ translateY: -1 }],
  },
  disabled: {
    opacity: 0.45,
  },
});
