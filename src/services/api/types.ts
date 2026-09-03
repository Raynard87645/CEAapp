import type { AppRole } from '@/constants/platforms';

export type { AppRole as UserRole } from '@/constants/platforms';

export type BookingListItem = {
  id: number;
  reference: string;
  clientFirst: string;
  clientLast: string;
  package: string;
  dates: string;
  duration: number | null;
  vehicle: string;
  status: string;
  bookingStatus: string;
  needsAttention: boolean;
};

export type BookingAddOnsResponse = {
  booking: BookingListItem;
  journey: JourneySummary;
  addOns: AddOnItem[];
};

export type BookingOverviewResponse = {
  booking: BookingListItem;
  journey: JourneySummary;
};

export type LoginResponse = {
  token: string;
  role: AppRole;
  firstName: string;
  fullName: string;
  bookingId: number | null;
  roleLabel: string;
  platformLabel: string;
  primaryRole: string | null;
};

export type MeResponse = {
  role: AppRole;
  firstName: string;
  fullName: string;
  bookingId: number | null;
  roleLabel: string;
  platformLabel: string;
  primaryRole: string | null;
};

export type JourneySummary = {
  fullName: string;
  firstName: string;
  experienceLevel: string;
  guestCount: number;
  durationDays: number;
  travelDates: string;
  destination: string;
  accommodation: string;
  vehicle: string;
  ceaName: string;
  hostName: string;
  arrival: { airport: string; time: string };
  departure: { airport: string; time: string };
  journeyStatus: 'finalized' | 'preparing';
};

export type ItineraryEvent = {
  day: string;
  title: string;
  time: string;
  place: string;
  detail: string;
  tag: string;
};

export type AddOnItem = {
  id: number;
  catalogKey: string;
  name: string;
  description: string;
  price: string;
  image: string;
  status: string;
  requestId: number | null;
};

export type UpdateItem = {
  id: string;
  from: string;
  message: string;
  time: string;
  kind: string;
  unread: boolean;
};

export type ApiError = {
  message: string;
  errors?: Record<string, string[]>;
};
