import { apiRequest } from '@/services/api/client';

export type TripSummary = {
  id: number;
  tripCode: string;
  clientName: string;
  experienceLevel: string;
  status: string;
  arrivalDate?: string;
  arrivalTime?: string;
  departureDate?: string;
  departureTime?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  routeLabel?: string;
  arrivalLocation?: string;
  arrivalAirport?: string;
  departureAirport?: string;
  accommodation?: string;
  vehicle?: string;
  ceaContact?: string;
  guestCount?: number;
  pickupTime?: string;
  itinerarySummary?: string;
  serviceNotes?: string;
  ceaNotes?: string;
  welcomeKit?: string;
  welcomeKitColour?: string;
  beverages?: string[];
  noveltyStops?: string;
  signatureEncounters?: string;
  readinessLockedAt?: string | null;
  prepNote?: string;
};

export type StatusUpdate = {
  id: number;
  message: string;
  location?: string | null;
  tripCode?: string | null;
  vehicleName?: string | null;
  photoUrl?: string | null;
  occurredAt?: string;
  timeLabel?: string;
  sentToFts: boolean;
};

export type Checkpoint = {
  key: string;
  label: string;
  confirmed: boolean;
  confirmedAt?: string | null;
  timeLabel?: string | null;
};

export type DriverShiftState = {
  id: number;
  trip_id: number;
  tripCode?: string | null;
  driver_id: number;
  status: string;

  itinerary_day_id?: number | null;
  day_type?: string | null;
  date?: string | null;

  required_check_in_at?: string | null;
  window_opens_at?: string | null;

  check_in_requested_at?: string | null;
  check_in_approved_at?: string | null;
  checked_in_at?: string | null;

  check_out_requested_at?: string | null;
  check_out_approved_at?: string | null;
  checked_out_at?: string | null;
};

export type TripCompletionState = {
  requested_at?: string | null;
  approved_at?: string | null;
  completed_at?: string | null;
};

export type DriverShiftResponse = {
  message: string;
  shift: DriverShiftState;
};

export type SafetyItem = {
  key: string;
  section: string;
  label: string;
  confirmed: boolean;
};

export type DriverReport = {
  id: number;
  type: string;
  description: string;
  photoUrl?: string | null;
  status?: string;
  createdAt?: string;
  timeLabel?: string;
  sentToFts: boolean;
};

export type ItineraryDay = {
  type?: string;
  date?: string;
  title?: string;
  focus?: string;
  fields?: Record<string, string>;
  attractions?: Array<{
    name: string;
    estimatedArrival?: string;
    estimatedDeparture?: string;
    ticketsRequired?: string;
    ticketsConfirmed?: string;
    vipRequired?: string;
    vipConfirmed?: string;
    mealNotes?: string;
    guestExperienceNotes?: string;
  }>;
};

export type DriverNotification = {
  id: string;
  message: string;
  tag?: string | null;
  createdAt?: string;
};

export type DriverDashboard = {
  driver: {
    id: number;
    code: string;
    name: string;
    status?: string;
    avatar?: string | null;
  };
  activeTrip: TripSummary | null;
  notifications: DriverNotification[];
  unreadCount: number;
};

export const driverApi = {
  dashboard: () => apiRequest<DriverDashboard>('/driver/dashboard'),

  notifications: () =>
    apiRequest<{ notifications: DriverNotification[]; unreadCount: number }>(
      '/driver/notifications',
    ),

  trips: () => apiRequest<{ trips: TripSummary[] }>('/driver/trips'),

  trip: (tripId: number) => apiRequest<{ trip: TripSummary }>(`/driver/trips/${tripId}`),

  itinerary: (tripId: number) =>
    apiRequest<{
      itinerary: {
        overview: {
          summary?: string;
          travelDates?: string;
          movementDays?: number | null;
        };
        booking: TripSummary;
        days: ItineraryDay[];
      };
    }>(`/driver/trips/${tripId}/itinerary`),

  updates: () => apiRequest<{ updates: StatusUpdate[] }>('/driver/updates'),

  postUpdate: (payload: {
    message?: string;
    location?: string;
    photoUri?: string | null;
  }) => {
    const form = new FormData();

    if (payload.message) {
      form.append('message', payload.message);
    }

    if (payload.location?.trim()) {
      form.append('location', payload.location.trim());
    }

    if (payload.photoUri) {
      form.append('photo', {
        uri: payload.photoUri,
        name: 'update.jpg',
        type: 'image/jpeg',
      } as unknown as Blob);
    }

    return apiRequest<{ update: StatusUpdate }>('/driver/updates', {
      method: 'POST',
      body: form,
    });
  },

  checkpoints: (tripId: number) =>
    apiRequest<{
      checkpoints: Checkpoint[];
      shift: DriverShiftState;
      trip_completion: TripCompletionState;
    }>(`/driver/trips/${tripId}/checkpoints`),

  toggleCheckpoint: (tripId: number, checkpoint: string) =>
    apiRequest<{ checkpoints: Checkpoint[] }>(
      `/driver/trips/${tripId}/checkpoints/${checkpoint}`,
      {
        method: 'POST',
      },
    ),

  requestCheckIn: (tripId: number) =>
    apiRequest<DriverShiftResponse>(`/driver/trips/${tripId}/check-in/request`, {
      method: 'POST',
    }),

  requestCheckOut: (tripId: number) =>
    apiRequest<DriverShiftResponse>(`/driver/trips/${tripId}/check-out/request`, {
      method: 'POST',
    }),

  requestEndTrip: (tripId: number) =>
    apiRequest<{
      message: string;
      trip: TripSummary & {
        trip_completion_requested_at?: string | null;
        trip_completion_approved_at?: string | null;
        completed_at?: string | null;
      };
      trip_completion: TripCompletionState;
    }>(`/driver/trips/${tripId}/end-trip/request`, { method: 'POST' }),

  safety: (tripId: number) =>
    apiRequest<{
      checklist: Record<string, SafetyItem[]>;
      reportTypes: string[];
      reports: DriverReport[];
    }>(`/driver/trips/${tripId}/safety`),

  toggleSafetyItem: (tripId: number, section: string, key: string) =>
    apiRequest<{ checklist: Record<string, SafetyItem[]> }>(
      `/driver/trips/${tripId}/safety/toggle`,
      {
        method: 'POST',
        body: { section, key },
      },
    ),

  submitReport: (
    tripId: number,
    payload: {
      type: string;
      description?: string;
      photoUri?: string | null;
    },
  ) => {
    const form = new FormData();

    form.append('type', payload.type);

    if (payload.description) {
      form.append('description', payload.description);
    }

    if (payload.photoUri) {
      form.append('photo', {
        uri: payload.photoUri,
        name: 'report.jpg',
        type: 'image/jpeg',
      } as unknown as Blob);
    }

    return apiRequest<{ report: DriverReport }>(`/driver/trips/${tripId}/reports`, {
      method: 'POST',
      body: form,
    });
  },
};
