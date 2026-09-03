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

function getDevApiBaseUrl(): string {
  const devHost =
    parseHostFromAddress(process.env.EXPO_PUBLIC_DEV_API_HOST) ??
    getExpoDevHost() ??
    '127.0.0.1';
  const port = getDevApiPort();

  if (Platform.OS === 'android' && (devHost === 'localhost' || devHost === '127.0.0.1')) {
    return `http://10.0.2.2:${port}/api/app`;
  }

  return `http://${devHost}:${port}/api/app`;
}

export function getApiBaseUrl(): string {
  if (__DEV__ && Platform.OS !== 'web') {
    return getDevApiBaseUrl();
  }

  const configured = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');
  return configured ?? PRODUCTION_API_URL;
}

export const AUTH_TOKEN_KEY = 'tjgt_auth_token';
