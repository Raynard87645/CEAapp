export type AppRole = 'client' | 'host' | 'admin' | 'fts' | 'driver';

export type PlatformTab = {
  name: string;
  label: string;
  icon: string;
  title: string;
};

export type PlatformConfig = {
  role: AppRole;
  label: string;
  eyebrow: string;
  homeRoute: '/(client)' | '/(admin)' | '/(fts)' | '/(driver)';
  welcomeMessage: string;
  welcomeDetail?: string;
  tabs: PlatformTab[];
};

export const CLIENT_JOURNEY_TABS: PlatformTab[] = [
  { name: 'index', label: 'Home', icon: '⌂', title: 'Home' },
  { name: 'itinerary', label: 'Itinerary', icon: 'calendar', title: 'Itinerary' },
  { name: 'addons', label: 'Add-ons', icon: '+', title: 'Add-ons' },
  { name: 'messages', label: 'Messages', icon: 'chat', title: 'Messages' },
  { name: 'updates', label: 'Updates', icon: '≡', title: 'Updates' },
];

/** Map API / legacy role strings to the app role used for routing. */
export function normalizeAppRole(value: string | null | undefined): AppRole | null {
  if (!value) return null;

  if (value === 'support') {
    return 'host';
  }

  return isAppRole(value) ? value : null;
}

export function isExperienceHost(role: AppRole | null | undefined): boolean {
  return role === 'host';
}

export function getJourneyTabsForRole(role: AppRole | null | undefined): PlatformTab[] {
  if (isExperienceHost(role)) {
    return CLIENT_JOURNEY_TABS.map((tab) =>
      tab.name === 'index'
        ? { ...tab, label: 'Bookings', title: 'Bookings', icon: '▤' }
        : tab,
    );
  }

  return CLIENT_JOURNEY_TABS;
}

export const PLATFORMS: Record<AppRole, PlatformConfig> = {
  client: {
    role: 'client',
    label: 'Tour Jamaica',
    eyebrow: 'GROUND TRANSPORT',
    homeRoute: '/(client)',
    welcomeMessage: 'Your Tour Jamaica experience is now ready.',
    welcomeDetail: 'Available inside your private app.',
    tabs: CLIENT_JOURNEY_TABS,
  },
  host: {
    role: 'host',
    label: 'Experience Host',
    eyebrow: 'EXPERIENCE HOST ENVIRONMENT',
    homeRoute: '/(client)',
    welcomeMessage: 'Preparing the consultation workspace.',
    tabs: getJourneyTabsForRole('host'),
  },
  admin: {
    role: 'admin',
    label: 'Administration',
    eyebrow: 'ADMINISTRATION',
    homeRoute: '/(admin)',
    welcomeMessage: 'Preparing your administration workspace.',
    tabs: [
      { name: 'index', label: 'Dashboard', icon: '⌂', title: 'Dashboard' },
      { name: 'tokens', label: 'Tokens', icon: '⌗', title: 'Login Tokens' },
      { name: 'payments', label: 'Payments', icon: '$', title: 'Payment Settings' },
    ],
  },
  fts: {
    role: 'fts',
    label: 'Fleet & Transport',
    eyebrow: 'FLEET & TRANSPORT SYSTEM',
    homeRoute: '/(fts)',
    welcomeMessage: 'Preparing your operations workspace.',
    tabs: [
      { name: 'index', label: 'Home', icon: '⌂', title: 'Dashboard' },
      { name: 'movements', label: 'Movements', icon: '◷', title: 'Movements' },
      { name: 'vehicles', label: 'Vehicles', icon: '▰', title: 'Vehicles' },
      { name: 'drivers', label: 'Drivers', icon: '●', title: 'Drivers' },
      { name: 'operations', label: 'Ops', icon: '≡', title: 'Operations' },
    ],
  },
  driver: {
    role: 'driver',
    label: 'Driver Portal',
    eyebrow: 'DRIVER PORTAL',
    homeRoute: '/(driver)',
    welcomeMessage: '',
    tabs: [
      { name: 'index', label: 'Updates', icon: '◉', title: 'Updates' },
      { name: 'trips', label: 'Trips', icon: '▤', title: 'Trips' },
      { name: 'itinerary', label: 'Itinerary', icon: 'calendar', title: 'Itinerary' },
      { name: 'checkin', label: 'Check-In', icon: '✓', title: 'Check-In' },
      { name: 'safety', label: 'Safety', icon: '◇', title: 'Safety' },
    ],
  },
};

export function getPlatformConfig(role: AppRole | null | undefined): PlatformConfig | null {
  if (!role) return null;
  return PLATFORMS[role] ?? null;
}

export function getPlatformHomeRoute(role: AppRole): PlatformConfig['homeRoute'] {
  return PLATFORMS[role].homeRoute;
}

export type DrawerLink = {
  label: string;
  icon: string;
  href: string;
  tabName: string;
};

export function getDrawerLinksForRole(role: AppRole | null | undefined): DrawerLink[] {
  if (!role) return [];

  const config = getPlatformConfig(role);
  if (!config) return [];

  const tabs = role === 'host' ? getJourneyTabsForRole('host') : config.tabs;

  return tabs.map((tab) => ({
    label: tab.label,
    icon: tab.icon,
    tabName: tab.name,
    href: tab.name === 'index' ? config.homeRoute : `${config.homeRoute}/${tab.name}`,
  }));
}

export function isAppRole(value: string | null | undefined): value is AppRole {
  return value === 'client' || value === 'host' || value === 'admin' || value === 'fts' || value === 'driver';
}
