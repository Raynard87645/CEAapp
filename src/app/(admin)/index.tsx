import { PlatformScreen } from '@/components/platform-screen';
import { PLATFORMS } from '@/constants/platforms';

export default function AdminDashboardScreen() {
  return (
    <PlatformScreen
      platform={PLATFORMS.admin}
      title="Dashboard"
      subtitle="Platform overview for Tour Jamaica administration."
    />
  );
}
