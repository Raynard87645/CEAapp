import { PlatformScreen } from '@/components/platform-screen';
import { PLATFORMS } from '@/constants/platforms';

export default function AdminTokensScreen() {
  return (
    <PlatformScreen
      platform={PLATFORMS.admin}
      title="Login Tokens"
      subtitle="Manage personal login tokens across CEP, FTS, and admin portals."
    />
  );
}
