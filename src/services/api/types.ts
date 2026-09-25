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
  destination: string | null;
  accommodation: string;
  vehicle: string | null;
  ceaName: string;
  hostName: string;
  arrival: {
    date: string | null;
    airport: string | null;
    time: string | null;
  };
  departure: {
    date: string | null;
    airport: string | null;
    time: string | null;
  };
  journeyStatus: 'finalized' | 'preparing';
};

export type ItineraryAttraction = {
  id: number;
  name: string;
  date: string | null;
  arrivalTime: string | null;
  departureTime: string | null;
  ticketsRequired: string | null;
  ticketsConfirmed: string | null;
  vipRequired: string | null;
  vipConfirmed: string | null;
  mealNotes: string | null;
  guestExperienceNotes: string | null;
};

export type ItineraryEvent = {
  day: string;
  title: string;
  time: string;
  place: string;
  detail: string;
  tag: string;
  attractions: ItineraryAttraction[];
};

export type AddOnStatus =
  | 'Available'
  | 'Requested'
  | 'Pending Review'
  | 'Awaiting Payment'
  | 'Confirmed'
  | 'Not Approved';

export type AddOnItem = {
  id: number;
  catalogKey: string;
  name: string;
  description: string;
  price: string | null;
  image: string | null;
  status: AddOnStatus;
  requestId: number | null;
  notApprovedReason: string | null;
};

export type UpdateItem = {
  id: string;
  from: string;
  message: string;
  time: string;
  kind: string;
  unread: boolean;
};

export type MessageParticipant = {
  id: string;
  name: string;
  role: string;
  initials: string;
  tripId: number;
  tripCode: string;
};

export type MessageConversationType =
  | 'client_driver'
  | 'driver_cea';

export type Message = {
  id: number;
  senderType: string;
  senderId: number;
  body: string;
  readAt: string | null;
  createdAt: string | null;
};

export type MessageConversation = {
  id: number;
  type: MessageConversationType;
  status: 'open' | 'closed' | string;
  tripId: number;
  tripCode: string;
};

export type MessagesResponse = {
  conversation: MessageConversation | null;
  messages: Message[];
};

export type SendMessageResponse = {
  message: Message;
};

export type ApiError = {
  message: string;
  errors?: Record<string, string[]>;
};