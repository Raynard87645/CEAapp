import { DriverTabLayout } from '@/components/driver-tab-layout';
import { PLATFORMS } from '@/constants/platforms';
import { DriverProvider } from '@/context/driver-context';

export default function DriverLayout() {
  return (
    <DriverProvider>
      <DriverTabLayout tabs={PLATFORMS.driver.tabs} />
    </DriverProvider>
  );
}
