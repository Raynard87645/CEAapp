import { PlatformScreen } from '@/components/platform-screen';
import { PLATFORMS } from '@/constants/platforms';

export default function DriverMessagesScreen() {
  return (
    <PlatformScreen
      platform={PLATFORMS.driver}
      title="Messages"
      subtitle="Operational updates from dispatch and your Tour Jamaica team."
    />
  );
}
