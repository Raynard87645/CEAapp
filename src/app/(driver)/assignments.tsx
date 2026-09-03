import { PlatformScreen } from '@/components/platform-screen';
import { PLATFORMS } from '@/constants/platforms';

export default function DriverAssignmentsScreen() {
  return (
    <PlatformScreen
      platform={PLATFORMS.driver}
      title="Assignments"
      subtitle="Upcoming trips, guest details, and transfer instructions."
    />
  );
}
