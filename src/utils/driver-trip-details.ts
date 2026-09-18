import type { TripSummary } from '@/services/api/driver';

function joinList(values?: string[] | null): string {
  if (!values?.length) {
    return '—';
  }

  return values.join(', ');
}

function welcomeKitLabel(trip: TripSummary): string {
  const kit = trip.welcomeKit?.trim();
  const colour = trip.welcomeKitColour?.trim();

  if (kit && colour) {
    return `${kit} · ${colour}`;
  }

  return kit || colour || '—';
}

export function coreTripDetails(trip: TripSummary) {
  return [
    { label: 'Trip Code', value: trip.tripCode ?? '—' },
    { label: 'Experience Level', value: trip.experienceLevel },
    { label: 'Trip Status', value: trip.status },
    { label: 'Route', value: trip.routeLabel ?? '—' },
    { label: 'Arrival Location', value: trip.arrivalLocation ?? '—' },
    { label: 'Arrival Date', value: trip.arrivalDate ?? '—' },
    { label: 'Arrival Time', value: trip.arrivalTime ?? '—' },
    { label: 'Arrival Airport', value: trip.arrivalAirport ?? '—' },
    { label: 'Pickup Time', value: trip.pickupTime ?? '—' },
    { label: 'Pickup Location', value: trip.pickupLocation ?? '—' },
    { label: 'Drop-Off Location', value: trip.dropoffLocation ?? '—' },
    { label: 'Accommodation', value: trip.accommodation ?? '—' },
    { label: 'Vehicle Selection', value: trip.vehicle ?? '—' },
    { label: 'CEA Contact', value: trip.ceaContact ?? '—' },
  ];
}

export function ftsServiceDetails(trip: TripSummary) {
  return [
    { label: 'Itinerary Summary', value: trip.itinerarySummary ?? '—' },
    { label: 'Welcome Kit', value: welcomeKitLabel(trip) },
    { label: 'Beverages', value: joinList(trip.beverages) },
    { label: 'Novelty Stop', value: trip.noveltyStops ?? '—' },
    { label: 'Signature Encounters', value: trip.signatureEncounters ?? '—' },
    { label: 'CEA Notes', value: trip.ceaNotes ?? '—' },
    { label: 'Service Notes', value: trip.serviceNotes ?? '—' },
  ];
}

export function bookingTripDetails(trip: TripSummary) {
  return [
    { label: 'Client Name', value: trip.clientName },
    { label: 'Number of Guests', value: `${trip.guestCount ?? 0} guests` },
    ...coreTripDetails(trip).slice(1),
    { label: 'Departure Date', value: trip.departureDate ?? '—' },
    { label: 'Departure Time', value: trip.departureTime ?? '—' },
    { label: 'Departure Airport', value: trip.departureAirport ?? '—' },
    ...ftsServiceDetails(trip),
  ];
}

export function formatShiftTimestamp(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  const match = value.match(/(?:T|\s)(\d{2}):(\d{2})/);

  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = match[2];
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${minutes} ${period}`;
}
