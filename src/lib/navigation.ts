import { router } from 'expo-router';

/** Leave nested tab/stack groups and return to the public landing screen. */
export function resetToLanding(): void {
  if (router.canDismiss()) {
    router.dismissAll();
  }

  router.replace('/');
}

export function isDrawerLinkActive(tabName: string, segments: string[]): boolean {
  const screen = segments[1];

  if (tabName === 'index') {
    return !screen || screen === 'index';
  }

  return screen === tabName;
}
