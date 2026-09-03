import { PlatformScreen } from '@/components/platform-screen';
import { PLATFORMS } from '@/constants/platforms';

export default function FtsDriversScreen() {
  return (
    <PlatformScreen
      platform={PLATFORMS.fts}
      title="Drivers"
      subtitle="Driver roster, assignments, and operational contact."
    />
  );
}
