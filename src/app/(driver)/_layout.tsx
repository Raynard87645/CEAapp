import { PLATFORMS } from '@/constants/platforms';
import { PlatformTabLayout } from '@/components/platform-tab-layout';

export default function DriverLayout() {
  return <PlatformTabLayout allowedRoles={['driver']} tabs={PLATFORMS.driver.tabs} />;
}
