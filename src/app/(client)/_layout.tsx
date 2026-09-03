import { JourneyProvider } from '@/context/journey-context';
import { getJourneyTabsForRole } from '@/constants/platforms';
import { PlatformTabLayout } from '@/components/platform-tab-layout';

export default function ClientLayout() {
  return (
    <JourneyProvider>
      <PlatformTabLayout
        allowedRoles={['client', 'host']}
        resolveTabs={(role) => getJourneyTabsForRole(role)}
      />
    </JourneyProvider>
  );
}
