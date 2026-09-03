import { PlatformScreen } from '@/components/platform-screen';
import { PLATFORMS } from '@/constants/platforms';

export default function AdminPaymentsScreen() {
  return (
    <PlatformScreen
      platform={PLATFORMS.admin}
      title="Payment Settings"
      subtitle="Configure payment gateways and merchant settings."
    />
  );
}
