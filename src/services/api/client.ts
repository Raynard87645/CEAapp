import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { AUTH_TOKEN_KEY, getApiBaseUrl } from '@/config/api';
import type {
  AddOnItem,
  AddOnStatus,
  ApiError,
  BookingAddOnsResponse,
  BookingListItem,
  BookingOverviewResponse,
  ItineraryEvent,
  JourneySummary,
  LoginResponse,
  MeResponse,
  MessageParticipant,
  MessagesResponse,
  SendMessageResponse,
  UpdateItem,
} from '@/services/api/types';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  auth?: boolean;
};

let memoryToken: string | null = null;

export async function getAuthToken(): Promise<string | null> {
  if (memoryToken) return memoryToken;

  if (Platform.OS === 'web') {
    memoryToken =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem(AUTH_TOKEN_KEY)
        : null;

    return memoryToken;
  }

  memoryToken =
    await SecureStore.getItemAsync(AUTH_TOKEN_KEY);

  return memoryToken;
}

export async function setAuthToken(
  token: string | null,
): Promise<void> {
  memoryToken = token;

  if (Platform.OS === 'web') {
    if (token) {
      localStorage.setItem(
        AUTH_TOKEN_KEY,
        token,
      );
    } else {
      localStorage.removeItem(
        AUTH_TOKEN_KEY,
      );
    }

    return;
  }

  if (token) {
    await SecureStore.setItemAsync(
      AUTH_TOKEN_KEY,
      token,
    );
  } else {
    await SecureStore.deleteItemAsync(
      AUTH_TOKEN_KEY,
    );
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const isFormData =
    typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.auth !== false) {
    const token = await getAuthToken();

    if (token) {
      headers.Authorization =
        `Bearer ${token}`;
    }
  }

  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${path}`;

  let response: Response;

  try {
    response = await fetch(url, {
      method: options.method ?? 'GET',
      headers,
      body: options.body
        ? isFormData
          ? (options.body as FormData)
          : JSON.stringify(options.body)
        : undefined,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Network request failed';

    if (
      /unknown host|finding host|network request failed|failed to connect|could not connect/i.test(
        message,
      )
    ) {
      throw new Error(
        `Cannot reach the Tour Jamaica API at ${baseUrl}. ` +
          (__DEV__
            ? 'Start the backend on port 8001 (not Expo’s 8081): cd ../tjgt && php artisan serve --host=0.0.0.0 --port=8001. If using a Mac-only hostname in EXPO_PUBLIC_API_URL, the app auto-swaps to your Expo LAN IP in dev — ensure your phone and Mac are on the same Wi-Fi.'
            : 'Check your internet connection and try again.'),
      );
    }

    throw new Error(message);
  }

  const data =
    await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = data as ApiError;

    const message =
      error.errors?.token?.[0] ??
      error.errors?.passcode?.[0] ??
      error.errors?.firstName?.[0] ??
      error.message ??
      'Request failed. Please try again.';

    throw new Error(message);
  }

  return data as T;
}

export const api = {
  login: (
    firstName: string,
    lastName: string,
    loginToken: string,
  ) =>
    apiRequest<LoginResponse>('/login', {
      method: 'POST',
      auth: false,
      body: {
        firstName,
        lastName,
        passcode: loginToken,
      },
    }),

  logout: () =>
    apiRequest<{ success: boolean }>(
      '/logout',
      {
        method: 'POST',
      },
    ),

  me: () =>
    apiRequest<MeResponse>('/me'),

  bookings: () =>
    apiRequest<{
      bookings: BookingListItem[];
    }>('/bookings'),

  bookingOverview: (
    bookingId: number,
  ) =>
    apiRequest<BookingOverviewResponse>(
      `/bookings/${bookingId}`,
    ),

  bookingItinerary: (bookingId: number) =>
    apiRequest<{
      itinerary: ItineraryEvent[];
    }>(`/bookings/${bookingId}/itinerary`),

  bookingAddOns: (
    bookingId: number,
  ) =>
    apiRequest<BookingAddOnsResponse>(
      `/bookings/${bookingId}/add-ons`,
    ),

  requestBookingAddOn: (
    bookingId: number,
    payload: {
      title: string;
      description?: string;
      requestedDate?: string;
      clientNotes?: string;
    },
  ) =>
    apiRequest<{
      request: {
        id: number;
        bookingId: number;
        title: string;
        description: string | null;
        requestedDate: string | null;
        status: AddOnStatus;
        notApprovedReason: string | null;
      };
    }>(
      `/bookings/${bookingId}/add-ons`,
      {
        method: 'POST',
        body: {
          title: payload.title,
          description: payload.description,
          requested_date: payload.requestedDate,
          client_notes: payload.clientNotes,
        },
      },
    ),

  journey: () =>
    apiRequest<{
      journey: JourneySummary;
    }>('/journey'),

  messageParticipants: () =>
    apiRequest<{
      participants: MessageParticipant[];
    }>('/messages/participants'),

  messages: () =>
    apiRequest<MessagesResponse>('/messages'),

  sendMessage: (message: string) =>
    apiRequest<SendMessageResponse>('/messages', {
      method: 'POST',
      body: {
        message,
      },
    }),

  markMessagesRead: () =>
    apiRequest<{ success: boolean }>('/messages/read', {
      method: 'POST',
    }),

  itinerary: () =>
    apiRequest<{
      itinerary: ItineraryEvent[];
    }>('/itinerary'),

  /*
   * Existing Journey-based add-on endpoints.
   * Leave these for now until the client
   * AddonsScreen has been switched over.
   */
  addOns: () =>
    apiRequest<{
      addOns: AddOnItem[];
    }>('/add-ons'),

  requestAddOn: (payload: {
    title: string;
    requestedDate?: string;
    description?: string;
  }) =>
    apiRequest<{
      addOns: AddOnItem[];
    }>('/add-ons', {
      method: 'POST',
      body: payload,
    }),

  notifications: () =>
    apiRequest<{
      updates: UpdateItem[];
      unreadCount: number;
    }>('/notifications'),

  markNotificationRead: (
    notificationKey: string,
  ) =>
    apiRequest<{
      success: boolean;
      unreadCount: number;
    }>(
      `/notifications/${encodeURIComponent(
        notificationKey,
      )}/read`,
      {
        method: 'POST',
      },
    ),

  sendBookingMessage: (
    bookingId: number,
    payload: {
      category: string;
      message: string;
    },
  ) =>
    apiRequest<{
      message: {
        sent: boolean;
        category: string;
        body: string;
        sentAt: string;
        notificationId: number | null;
      };
    }>(
      `/bookings/${bookingId}/messages`,
      {
        method: 'POST',
        body: payload,
      },
    ),
};