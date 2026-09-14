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
  arrivalAirport?: string;
  accommodation?: string;
  vehicle?: string;
  ceaContact?: string;
  guestCount?: number;
  pickupTime?: string;
  itinerarySummary?: string;
  prepNote?: string;
};

export type StatusUpdate = {
  id: number;
  message: string;
  location?: string | null;
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

export type SafetyItem = {
  key: string;
  section: string;
  label: string;
  confirmed: boolean;
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

export type DriverDashboard = {
  driver: {
    id: number;
    code: string;
    name: string;
    status?: string;
    avatar?: string | null;
  };
  activeTrip: TripSummary | null;
  notifications: Array<{
    id: string;
    message: string;
    tag?: string | null;
    createdAt?: string;
  }>;
  unreadCount: number;
};

export const driverApi = {
  dashboard: () => apiRequest<DriverDashboard>('/driver/dashboard'),

  trips: () => apiRequest<{ trips: TripSummary[] }>('/driver/trips'),

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

  postUpdate: (payload: { message?: string; photoUri?: string | null }) => {
    const form = new FormData();

    if (payload.message) {
      form.append('message', payload.message);
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
    apiRequest<{ checkpoints: Checkpoint[] }>(`/driver/trips/${tripId}/checkpoints`),

  toggleCheckpoint: (tripId: number, checkpoint: string) =>
    apiRequest<{ checkpoints: Checkpoint[] }>(
      `/driver/trips/${tripId}/checkpoints/${checkpoint}`,
      { method: 'POST' },
    ),

  safety: (tripId: number) =>
    apiRequest<{
      checklist: Record<string, SafetyItem[]>;
      reportTypes: string[];
      reports: Array<{
        id: number;
        type: string;
        description: string;
        timeLabel?: string;
        sentToFts: boolean;
      }>;
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
    payload: { type: string; description?: string; photoUri?: string | null },
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

    return apiRequest<{ report: { id: number; type: string; description: string } }>(
      `/driver/trips/${tripId}/reports`,
      {
        method: 'POST',
        body: form,
      },
    );
  },
};
