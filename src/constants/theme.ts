import { Platform } from 'react-native';

export const Palette = {
  cream: '#F5F0E5',
  paper: '#FBF8F1',
  green: '#123C2E',
  forest: '#092C22',
  sage: '#DCE7D8',
  lime: '#B9CFAE',
  gold: '#C9A86A',
  ink: '#14211B',
  muted: '#6D756E',
  line: '#DED8CA',
  white: '#FFFFFF',
  greenLight: '#3E6A55',
  greenMuted: '#54715F',
  storyText: '#CBD6CF',
  storyFooter: '#B9C6BE',
  goldLight: '#D9C08C',
} as const;

export const Colors = {
  light: {
    text: Palette.ink,
    background: Palette.cream,
    backgroundElement: Palette.paper,
    backgroundSelected: Palette.sage,
    textSecondary: Palette.muted,
    primary: Palette.green,
    accent: Palette.gold,
    border: Palette.line,
    surface: Palette.white,
  },
  dark: {
    text: Palette.cream,
    background: Palette.forest,
    backgroundElement: Palette.green,
    backgroundSelected: '#1B4B38',
    textSecondary: '#B9C6BE',
    primary: Palette.lime,
    accent: Palette.gold,
    border: '#2E4A3D',
    surface: Palette.green,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    mono: 'Menlo',
  },
  android: {
    sans: 'sans-serif',
    serif: 'serif',
    mono: 'monospace',
  },
  default: {
    sans: 'System',
    serif: 'serif',
    mono: 'monospace',
  },
  web: {
    sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
    serif: 'Georgia, ui-serif, serif',
    mono: 'ui-monospace, monospace',
  },
});

export const Typography = {
  eyebrow: {
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 2.2,
    textTransform: 'uppercase' as const,
  },
  heroTitle: {
    fontSize: 52,
    fontWeight: '400' as const,
    lineHeight: 48,
    fontFamily: Fonts.serif,
  },
  pageTitle: {
    fontSize: 42,
    fontWeight: '400' as const,
    lineHeight: 46,
    fontFamily: Fonts.serif,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '400' as const,
    fontFamily: Fonts.serif,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  small: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500' as const,
  },
  caption: {
    fontSize: 9,
    lineHeight: 14,
    fontWeight: '500' as const,
  },
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Layout = {
  maxWidth: 480,
  headerHeight: 68,
  bottomNavHeight: 70,
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    full: 999,
  },
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = Layout.maxWidth;
