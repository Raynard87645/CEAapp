import { PlatformScreen } from '@/components/platform-screen';
import { PLATFORMS } from '@/constants/platforms';

export default function FtsDashboardScreen() {
  return (
    <PlatformScreen
      platform={PLATFORMS.fts}
      title="Operations dashboard"
      subtitle="Fleet readiness, assigned movements, and daily priorities."
    />
  );
}
