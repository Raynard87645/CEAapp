import { PLATFORMS } from '@/constants/platforms';
import { getPlatformHomeRoute } from '@/constants/platforms';
import { useAuth } from '@/context/auth-context';

export function usePlatformRedirect() {
  const { role } = useAuth();

  if (!role) {
    return '/';
  }

  return getPlatformHomeRoute(role);
}

export { PLATFORMS, getPlatformHomeRoute };
