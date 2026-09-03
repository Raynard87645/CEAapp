import { PLATFORMS } from '@/constants/platforms';
import { PlatformTabLayout } from '@/components/platform-tab-layout';

export default function FtsLayout() {
  return <PlatformTabLayout allowedRoles={['fts']} tabs={PLATFORMS.fts.tabs} />;
}
