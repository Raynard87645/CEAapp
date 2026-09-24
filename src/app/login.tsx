import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandHeader } from '@/components/brand-header';
import { AppButton } from '@/components/ui/app-button';
import { EyebrowText, SerifTitle } from '@/components/ui/typography';
import { getPlatformHomeRoute } from '@/constants/platforms';
import { Layout, Palette, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isAuthenticated, isBootstrapping, hasCompletedWelcome, role } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loginToken, setLoginToken] = useState('');
  const [showLoginToken, setShowLoginToken] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isBootstrapping || !isAuthenticated) return;

    if (!hasCompletedWelcome) {
      router.replace('/welcome');
      return;
    }

    if (!role) return;

    router.replace(getPlatformHomeRoute(role));
  }, [isAuthenticated, isBootstrapping, hasCompletedWelcome, role, router]);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setError('');
    setIsSubmitting(true);

    try {
      const result = await login(firstName, lastName, loginToken);
      if (!result.success) {
        setError(result.error ?? 'Unable to sign in.');
        return;
      }
      router.replace('/welcome');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <BrandHeader style={styles.brand} />

          <View style={styles.card}>
            <EyebrowText>PRIVATE ACCESS</EyebrowText>
            <SerifTitle size="page" style={styles.title}>
              Welcome
            </SerifTitle>
            <Text style={styles.subtitle}>
              Sign in with your first name, last name, and passcode. Your environment is determined
              automatically after authentication.
            </Text>

            <View style={styles.nameRow}>
              <View style={styles.field}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="First name"
                  placeholderTextColor={Palette.muted}
                  autoComplete="given-name"
                  autoCapitalize="words"
                  style={styles.input}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Last name"
                  placeholderTextColor={Palette.muted}
                  autoComplete="family-name"
                  autoCapitalize="words"
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Passcode</Text>
              <View style={styles.passwordWrap}>
                <TextInput
                  value={loginToken}
                  onChangeText={setLoginToken}
                  placeholder="Enter your passcode"
                  placeholderTextColor={Palette.muted}
                  secureTextEntry={!showLoginToken}
                  autoComplete="password"
                  onSubmitEditing={handleSubmit}
                  style={[styles.input, styles.passwordInput]}
                />
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setShowLoginToken((visible) => !visible)}
                  style={styles.showButton}>
                  <Text style={styles.showButtonText}>{showLoginToken ? 'HIDE' : 'SHOW'}</Text>
                </Pressable>
              </View>
            </View>

            {error ? (
              <Text accessibilityRole="alert" style={styles.error}>
                {error}
              </Text>
            ) : null}

            <AppButton
              label={isSubmitting ? 'Signing in…' : 'Enter'}
              fullWidth
              disabled={isSubmitting}
              onPress={handleSubmit}
              style={styles.submit}
            />

            <View style={styles.secondaryActions}>
              <Pressable
                onPress={() =>
                  setError('Camera access will be available in the production mobile app.')
                }>
                <Text style={styles.secondaryAction}>⌗ Scan Code</Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  setError('Contact your Client Experience Architect if you need a passcode reset.')
                }>
                <Text style={styles.secondaryAction}>Forgot Passcode</Text>
              </Pressable>
            </View>

            <Text style={styles.security}>▣ Secured Tour Jamaica sign-in</Text>

            <Pressable accessibilityRole="button" onPress={() => router.back()}>
              <Text style={styles.backLink}>Back to welcome</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.paper,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingBottom: Spacing.five,
  },
  brand: {
    marginTop: Spacing.three,
    marginBottom: 42,
  },
  card: {
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
  },
  title: {
    marginTop: Spacing.two,
    marginBottom: 8,
  },
  subtitle: {
    color: Palette.muted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.three,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 10,
  },
  field: {
    flex: 1,
    marginBottom: Spacing.two,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Palette.ink,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Palette.line,
    backgroundColor: Palette.white,
    borderRadius: Layout.borderRadius.sm,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: '#48534C',
  },
  passwordWrap: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 64,
  },
  showButton: {
    position: 'absolute',
    right: 5,
    top: 8,
    padding: 10,
  },
  showButtonText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: Palette.green,
  },
  error: {
    color: '#355441',
    backgroundColor: '#EEF3EA',
    borderLeftWidth: 2,
    borderLeftColor: Palette.gold,
    padding: 10,
    fontSize: 11,
    lineHeight: 16,
    marginBottom: Spacing.two,
  },
  submit: {
    marginTop: Spacing.two,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  secondaryAction: {
    color: Palette.green,
    fontSize: 9,
    fontWeight: '700',
  },
  security: {
    textAlign: 'center',
    color: Palette.muted,
    fontSize: 9,
    marginTop: 18,
  },
  backLink: {
    textAlign: 'center',
    color: Palette.muted,
    fontSize: 9,
    marginTop: 8,
    paddingVertical: 8,
  },
});
