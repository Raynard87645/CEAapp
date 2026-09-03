import { PLATFORMS } from '@/constants/platforms';
import { PlatformTabLayout } from '@/components/platform-tab-layout';

export default function AdminLayout() {
  return <PlatformTabLayout allowedRoles={['admin']} tabs={PLATFORMS.admin.tabs} />;
}
