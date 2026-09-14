import Constants from 'expo-constants';
import { Platform } from 'react-native';

const PRODUCTION_API_URL = 'https://appfinity-tjgt.com/api/app';
const DEFAULT_DEV_API_PORT = '8001';

/** Expo Metro uses 8081 — the Laravel API must use 8001 (or EXPO_PUBLIC_API_PORT). */
function getDevApiPort(): string {
  const configured = process.env.EXPO_PUBLIC_API_PORT?.trim();
  if (configured && configured !== '8081') {
    return configured;
  }
  return DEFAULT_DEV_API_PORT;
}

function parseHostFromAddress(address: string | null | undefined): string | null {
  if (!address) return null;

  let value = address.trim();

  // exp://192.168.50.149:8081 or http://192.168.50.149:8081
  value = value.replace(/^[a-z][a-z0-9+.-]*:\/\//i, '');

  // [fe80::1]:8081
  const bracketMatch = value.match(/^\[([^\]]+)\](?::\d+)?$/);
  if (bracketMatch) {
    return bracketMatch[1] || null;
  }

  // 192.168.50.149:8081 — strip Metro/dev port, never reuse it for the API.
  const lastColon = value.lastIndexOf(':');
  if (lastColon > -1 && /^\d+$/.test(value.slice(lastColon + 1))) {
    value = value.slice(0, lastColon);
  }

  if (!value || value === 'localhost') {
    return null;
  }

  return value;
}

function getExpoDevHost(): string | null {
  const candidates = [
    Constants.expoConfig?.hostUri,
    Constants.expoGoConfig?.debuggerHost,
    (Constants as { manifest?: { debuggerHost?: string } }).manifest?.debuggerHost,
  ];

  for (const candidate of candidates) {
    const host = parseHostFromAddress(candidate);
    if (host) return host;
  }

  return null;
}

function isPrivateLanHost(host: string): boolean {
  if (host === '10.0.2.2') {
    return true;
  }

  const parts = host.split('.').map(Number);
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) {
    return false;
  }

  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return false;
}

function getDevApiHost(): string {
  const manualHost = parseHostFromAddress(process.env.EXPO_PUBLIC_DEV_API_HOST);
  if (manualHost) {
    return manualHost;
  }

  const expoHost = getExpoDevHost();
  if (expoHost && isPrivateLanHost(expoHost)) {
    return expoHost;
  }

  if (Platform.OS === 'android') {
    return '10.0.2.2';
  }

  return '127.0.0.1';
}

function buildDevApiBaseUrl(pathname: string): string {
  const devHost = getDevApiHost();
  const port = getDevApiPort();
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;

  return `http://${devHost}:${port}${path}`.replace(/\/$/, '');
}

function getDevApiBaseUrl(): string {
  return buildDevApiBaseUrl('/api/app');
}

function getConfiguredApiUrl(): string | null {
  const configured = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/$/, '');
  return configured || null;
}

/** Hosts that only resolve on the dev machine (/etc/hosts), not on phones or emulators. */
function hostnameRequiresDevRewrite(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (lower === 'localhost' || lower === '127.0.0.1') {
    return true;
  }
  // Mac /etc/hosts alias — not in public DNS.
  if (lower === 'appfinity-tjgt.com') {
    return true;
  }
  if (lower.endsWith('.local')) {
    return true;
  }
  return false;
}

function resolveConfiguredUrlForNativeDev(configured: string): string {
  try {
    const url = new URL(configured);
    if (!hostnameRequiresDevRewrite(url.hostname)) {
      return configured;
    }

    return buildDevApiBaseUrl(url.pathname || '/api/app');
  } catch {
    return getDevApiBaseUrl();
  }
}

export function getApiBaseUrl(): string {
  const configured = getConfiguredApiUrl();

  if (__DEV__ && Platform.OS !== 'web') {
    if (configured) {
      return resolveConfiguredUrlForNativeDev(configured);
    }
    return getDevApiBaseUrl();
  }

  return configured ?? PRODUCTION_API_URL;
}

export const AUTH_TOKEN_KEY = 'tjgt_auth_token';
