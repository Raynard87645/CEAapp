import { PlatformScreen } from '@/components/platform-screen';
import { PLATFORMS } from '@/constants/platforms';

export default function FtsOperationsScreen() {
  return (
    <PlatformScreen
      platform={PLATFORMS.fts}
      title="Operations"
      subtitle="Dispatch notes, payroll visibility, and platform controls."
    />
  );
}
