import { PlatformScreen } from '@/components/platform-screen';
import { PLATFORMS } from '@/constants/platforms';

export default function FtsMovementsScreen() {
  return (
    <PlatformScreen
      platform={PLATFORMS.fts}
      title="Movements"
      subtitle="Airport pickups, guest transfers, and assigned routes."
    />
  );
}
