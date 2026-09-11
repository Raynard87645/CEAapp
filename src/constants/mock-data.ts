export type ItineraryEvent = {
  id: string;
  title: string;
  time: string;
  place: string;
  detail: string;
  tag: string;
};

export type ItineraryDay = {
  day: string;
  date: string;
  events: ItineraryEvent[];
};

export type Addon = {
  id: number;
  name: string;
  description: string;
  price: string;
  status:
    | 'Available'
    | 'Processing'
    | 'Approved — Payment Available'
    | 'Confirmed';
  image: string;
};

export type Update = {
  id: number;
  from: string;
  message: string;
  time: string;
  kind: string;
  unread: boolean;
};

export const ITINERARY: ItineraryDay[] = [
  {
    day: 'SAT 12',
    date: '2026-09-12',
    events: [
      {
        id: 'sat-arrival',
        title: 'Arrival at MBJ',
        time: '2:35 p.m.',
        place: 'Sangster International Airport',
        detail: 'Priority Arrival Access and airport assistance.',
        tag: 'Arrival',
      },
      {
        id: 'sat-transfer',
        title: 'Private Transfer',
        time: '3:15 p.m.',
        place: 'MBJ → Half Moon',
        detail: 'Private transfer from the airport to Half Moon.',
        tag: 'Transfer',
      },
      {
        id: 'sat-checkin',
        title: 'Resort Check-In',
        time: '4:00 p.m.',
        place: 'Half Moon, Montego Bay',
        detail: 'Check in, settle in, and enjoy the resort at your own pace.',
        tag: 'Accommodation',
      },
    ],
  },
  {
    day: 'SUN 13',
    date: '2026-09-13',
    events: [
      {
        id: 'sun-dunns',
        title: "Dunn's River Falls",
        time: '9:00 a.m.',
        place: 'Ocho Rios',
        detail: 'Private guided experience at Dunn’s River Falls.',
        tag: 'Attraction 01',
      },
      {
        id: 'sun-lunch',
        title: 'Guest-Selected Lunch',
        time: '12:30 p.m.',
        place: 'Ocho Rios',
        detail: 'Lunch stop selected around the group’s preferences.',
        tag: 'Dining',
      },
      {
        id: 'sun-blue-hole',
        title: 'Blue Hole',
        time: '2:30 p.m.',
        place: 'Ocho Rios',
        detail: 'Swimming and guided exploration at Blue Hole.',
        tag: 'Attraction 02',
      },
      {
        id: 'sun-return',
        title: 'Return to Resort',
        time: '5:30 p.m.',
        place: 'Ocho Rios → Half Moon',
        detail: 'Private transfer back to Half Moon.',
        tag: 'Transfer',
      },
    ],
  },
  {
    day: 'MON 14',
    date: '2026-09-14',
    events: [
      {
        id: 'mon-leisure',
        title: 'Morning at Leisure',
        time: 'At your pace',
        place: 'Half Moon, Montego Bay',
        detail: 'Enjoy the resort and amenities at your own pace.',
        tag: 'Leisure',
      },
      {
        id: 'mon-spa',
        title: 'Spa & Resort Time',
        time: '2:00 p.m.',
        place: 'Half Moon',
        detail: 'Optional resort and wellness time.',
        tag: 'Leisure',
      },
      {
        id: 'mon-dinner',
        title: 'Dinner Reservation',
        time: '7:30 p.m.',
        place: 'Montego Bay',
        detail: 'Dinner reservation coordinated by your Tour Jamaica team.',
        tag: 'Dining',
      },
    ],
  },
  {
    day: 'TUE 15',
    date: '2026-09-15',
    events: [
      {
        id: 'tue-ys-falls',
        title: 'YS Falls',
        time: '8:30 a.m.',
        place: 'St. Elizabeth',
        detail: 'Private guided experience at YS Falls.',
        tag: 'Attraction 01',
      },
      {
        id: 'tue-lunch',
        title: 'South Coast Lunch',
        time: '12:30 p.m.',
        place: 'South Coast',
        detail: 'Curated dining stop before the afternoon experience.',
        tag: 'Dining',
      },
      {
        id: 'tue-appleton',
        title: 'Appleton Estate',
        time: '2:30 p.m.',
        place: 'St. Elizabeth',
        detail: 'Guided Appleton Estate experience.',
        tag: 'Attraction 02',
      },
      {
        id: 'tue-return',
        title: 'Return to Resort',
        time: '6:00 p.m.',
        place: 'South Coast → Half Moon',
        detail: 'Private transfer back to Montego Bay.',
        tag: 'Transfer',
      },
    ],
  },
  {
    day: 'WED 16',
    date: '2026-09-16',
    events: [
      {
        id: 'wed-checkout',
        title: 'Resort Check-Out',
        time: '9:30 a.m.',
        place: 'Half Moon',
        detail: 'Luggage assistance and final departure preparation.',
        tag: 'Accommodation',
      },
      {
        id: 'wed-transfer',
        title: 'Private Airport Transfer',
        time: '10:15 a.m.',
        place: 'Half Moon → MBJ',
        detail: 'Private departure transfer to Sangster International Airport.',
        tag: 'Transfer',
      },
      {
        id: 'wed-departure',
        title: 'Departure Assistance',
        time: '11:00 a.m.',
        place: 'Sangster International Airport',
        detail: 'Departure assistance coordinated by the Tour Jamaica team.',
        tag: 'Departure',
      },
    ],
  },
];

export const ADDONS: Addon[] = [
  {
    id: 0,
    name: 'Private Yacht',
    description: "A private afternoon sail along Montego Bay's coastline.",
    price: 'Price to be confirmed',
    status: 'Approved — Payment Available',
    image:
      'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=700&q=88',
  },
  {
    id: 1,
    name: 'Helicopter Tour',
    description: "See Jamaica's emerald interior from a new perspective.",
    price: 'From US$1,250',
    status: 'Available',
    image:
      'https://www.maverickhelicopter.com/images/fleet/airbus-130-1000x666-1.jpg',
  },
  {
    id: 2,
    name: 'Private Dinner',
    description: 'A chef-led dinner created for your family.',
    price: 'Price to be confirmed',
    status: 'Available',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=700&q=88',
  },
  {
    id: 3,
    name: 'Cake / Celebration',
    description: 'A custom celebration detail delivered to your suite.',
    price: 'From US$95',
    status: 'Processing',
    image:
      'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=700&q=88',
  },
  {
    id: 4,
    name: 'Lime Cay',
    description: 'A private island day with seamless transfers.',
    price: 'Price to be confirmed',
    status: 'Available',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=88',
  },
  {
    id: 5,
    name: 'Solitude Hike',
    description: "A guided, unhurried trail through Jamaica's lush interior.",
    price: 'From US$180',
    status: 'Available',
    image:
      'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=700&q=88',
  },
  {
    id: 6,
    name: 'Priority Dinner Transfer',
    description: 'Dedicated evening transportation, timed to your reservation.',
    price: 'From US$140',
    status: 'Available',
    image:
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Mercedes-AMG_GLS_63_4MATIC%2B_%28X167%29_rear.jpg',
  },
  {
    id: 7,
    name: 'Jet Skiing',
    description: 'A guided ride across the calm Montego Bay coast.',
    price: 'From US$175',
    status: 'Available',
    image:
      'https://images.unsplash.com/photo-1756312827982-3137a944865d?auto=format&fit=crop&w=700&q=88',
  },
  {
    id: 8,
    name: 'Snorkeling',
    description: 'A private reef experience with equipment and guide.',
    price: 'From US$120',
    status: 'Available',
    image:
      'https://images.unsplash.com/photo-1622040881732-72354e8f019d?auto=format&fit=crop&w=700&q=88',
  },
  {
    id: 9,
    name: 'Private Dining',
    description: 'An intimate table in a specially selected setting.',
    price: 'Price to be confirmed',
    status: 'Available',
    image:
      'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=700&q=88',
  },
];

export const INITIAL_UPDATES: Update[] = [
  {
    id: 1,
    from: 'Alicia Brown, CEA',
    message: 'Your itinerary has been updated.',
    time: '10:42 a.m.',
    kind: 'Itinerary updated',
    unread: true,
  },
  {
    id: 2,
    from: 'Andre Williams, Experience Host',
    message: 'Your pickup has been confirmed.',
    time: '1:15 p.m.',
    kind: 'Pickup confirmed',
    unread: true,
  },
  {
    id: 3,
    from: 'Tour Jamaica',
    message: 'Your celebration add-on is being reviewed.',
    time: '3:05 p.m.',
    kind: 'Add-on request update',
    unread: true,
  },
  {
    id: 4,
    from: 'Alicia Brown, CEA',
    message: 'Payment is now available for your Private Yacht request.',
    time: 'Yesterday',
    kind: 'Payment available',
    unread: false,
  },
];

export const MESSAGE_QUICK_OPTIONS = [
  'I have a question about my itinerary.',
  'I want to adjust an excursion.',
  'I want to request an add-on.',
  'I need help with arrival details.',
  'I need help with accommodation details.',
  'Other',
] as const;

export const JAMAICA_DESTINATIONS = [
  'MONTEGO BAY',
  'NEGRIL',
  'OCHO RIOS',
  'KINGSTON',
] as const;