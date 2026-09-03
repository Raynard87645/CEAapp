import { PlatformScreen } from '@/components/platform-screen';
import { PLATFORMS } from '@/constants/platforms';

export default function DriverTodayScreen() {
  return (
    <PlatformScreen
      platform={PLATFORMS.driver}
      title="Today"
      subtitle="Your active route, next pickup, and readiness checklist."
    />
  );
}
