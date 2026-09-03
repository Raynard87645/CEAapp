import { PlatformScreen } from '@/components/platform-screen';
import { PLATFORMS } from '@/constants/platforms';

export default function FtsVehiclesScreen() {
  return (
    <PlatformScreen
      platform={PLATFORMS.fts}
      title="Vehicles"
      subtitle="Fleet availability, assignments, and readiness status."
    />
  );
}
