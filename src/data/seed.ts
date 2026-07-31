import type {
  AuthUser,
  Booking,
  CalendarSlot,
  CatalogService,
  DashboardKpis,
  GarageProfile,
  OperatingHours,
  Payout,
  Promotion,
  QuoteRequest,
  Review,
  ServiceOffering,
} from '../domain/types';

const defaultHours: OperatingHours[] = [
  { day: 'Monday', open: true, start: '09:00', end: '18:00' },
  { day: 'Tuesday', open: true, start: '09:00', end: '18:00' },
  { day: 'Wednesday', open: true, start: '09:00', end: '18:00' },
  { day: 'Thursday', open: true, start: '09:00', end: '18:00' },
  { day: 'Friday', open: true, start: '09:00', end: '17:00' },
  { day: 'Saturday', open: true, start: '10:00', end: '16:00' },
  { day: 'Sunday', open: false, start: '09:00', end: '18:00' },
];

export const DEMO_USER: AuthUser = {
  id: 'user-khalid',
  email: 'khalid@alquozgarage.ae',
  displayName: 'Khalid Al-Mansouri',
  initials: 'KA',
};

export const DEMO_GARAGE: GarageProfile = {
  id: 'garage-alquoz-01',
  name: 'Al Quoz Auto Care',
  ownerName: 'Khalid Al-Mansouri',
  whatsapp: '+971 50 123 4567',
  phone: '+971 4 338 2200',
  email: 'support@alquozgarage.ae',
  description:
    'Full-service workshop specializing in Japanese & German cars. Insurer-approved for AXA, Oman Insurance & Sukoon. 6 bays, same-day diagnostics.',
  address: 'Warehouse 14, Al Quoz Industrial Area 3',
  city: 'Dubai',
  lat: 25.1382,
  lng: 55.2285,
  status: 'live',
  rating: 4.8,
  reviewCount: 126,
  insurers: ['AXA Gulf', 'Oman Insurance', 'Sukoon'],
  gallery: [],
  mainImage: undefined,
  tradeLicenseUploaded: true,
  hours: defaultHours,
  submittedOn: '2026-07-12',
};

export const CATALOG_SERVICES: CatalogService[] = [
  { id: 'oil', name: 'Oil Change', icon: 'droplet' },
  { id: 'tire', name: 'Tire Replacement', icon: 'tire' },
  { id: 'diag', name: 'Car Diagnostics', icon: 'car' },
  { id: 'brake', name: 'Brake Services', icon: 'brake' },
  { id: 'ac', name: 'AC Repair', icon: 'ac' },
  { id: 'battery', name: 'Battery Replacement', icon: 'battery' },
  { id: 'body', name: 'Body Work', icon: 'body' },
  { id: 'wrap', name: 'Car Wrapping', icon: 'wrap' },
  { id: 'polish', name: 'Car Polishing', icon: 'polish' },
  { id: 'tint', name: 'Car Tinting', icon: 'tint' },
  { id: 'wash', name: 'Car Wash & Detailing', icon: 'wash' },
  { id: 'other', name: 'Other Services', icon: 'other' },
];

export const SEED_SERVICES: ServiceOffering[] = [
  {
    id: 'svc-1',
    name: 'Standard Oil Change',
    category: 'General Maintenance',
    durationMinutes: 30,
    priceAed: 120,
    compareAtAed: 100,
    active: true,
  },
  {
    id: 'svc-2',
    name: 'Brake Pad Replacement (Front)',
    category: 'Brake Services',
    durationMinutes: 90,
    priceAed: 350,
    active: true,
  },
  {
    id: 'svc-3',
    name: 'Tire Rotation & Balance',
    category: 'Tire Services',
    durationMinutes: 45,
    priceAed: 80,
    active: true,
  },
  {
    id: 'svc-4',
    name: 'Engine Diagnostic Scan',
    category: 'Engine Repair',
    durationMinutes: 60,
    priceAed: 180,
    active: true,
  },
  {
    id: 'svc-5',
    name: 'AC System Recharge',
    category: 'General Maintenance',
    durationMinutes: 75,
    priceAed: 250,
    compareAtAed: 220,
    active: true,
  },
  {
    id: 'svc-6',
    name: 'Interior & Exterior Detailing',
    category: 'Detailing',
    durationMinutes: 180,
    priceAed: 500,
    active: true,
  },
];

export const SEED_BOOKINGS: Booking[] = [
  {
    id: 'GG-87654',
    customerName: 'Sarah Johnson',
    customerInitials: 'SJ',
    serviceName: 'Oil Change & Tire Rotation',
    scheduledAt: '2026-08-01T10:00:00+04:00',
    status: 'pending',
    vehicle: '2021 Toyota RAV4',
  },
  {
    id: 'GG-87655',
    customerName: 'Omar Hassan',
    customerInitials: 'OH',
    serviceName: 'Engine Diagnostic & Repair',
    scheduledAt: '2026-08-01T14:00:00+04:00',
    status: 'pending',
    vehicle: '2019 Nissan Patrol',
  },
  {
    id: 'GG-87640',
    customerName: 'Fatima Al Zaabi',
    customerInitials: 'FZ',
    serviceName: 'Brake Pad Replacement (Front)',
    scheduledAt: '2026-08-01T11:30:00+04:00',
    status: 'confirmed',
    vehicle: '2022 BMW X5',
  },
  {
    id: 'GG-87620',
    customerName: 'James Wright',
    customerInitials: 'JW',
    serviceName: 'AC System Recharge',
    scheduledAt: '2026-07-30T09:00:00+04:00',
    status: 'confirmed',
    vehicle: '2020 Honda Accord',
  },
  {
    id: 'GG-87590',
    customerName: 'Layla Rahman',
    customerInitials: 'LR',
    serviceName: 'Interior & Exterior Detailing',
    scheduledAt: '2026-07-28T15:00:00+04:00',
    status: 'rejected',
    rejectionReason: 'Fully booked — please try next week.',
    vehicle: '2023 Mercedes C-Class',
  },
  {
    id: 'GG-87550',
    customerName: 'Ahmed Mansoor',
    customerInitials: 'AM',
    serviceName: 'Standard Oil Change',
    scheduledAt: '2026-07-25T10:00:00+04:00',
    status: 'completed',
    vehicle: '2018 Kia Sportage',
  },
  {
    id: 'GG-87551',
    customerName: 'Priya Sharma',
    customerInitials: 'PS',
    serviceName: 'Tire Rotation & Balance',
    scheduledAt: '2026-07-26T13:00:00+04:00',
    status: 'completed',
    vehicle: '2021 Hyundai Tucson',
  },
  {
    id: 'GG-87660',
    customerName: 'Daniel Okonkwo',
    customerInitials: 'DO',
    serviceName: 'Battery Replacement',
    scheduledAt: '2026-08-02T09:30:00+04:00',
    status: 'pending',
    vehicle: '2017 Ford Explorer',
  },
  {
    id: 'GG-87661',
    customerName: 'Noor Al Ketbi',
    customerInitials: 'NK',
    serviceName: 'Car Wash & Detailing',
    scheduledAt: '2026-08-02T16:00:00+04:00',
    status: 'pending',
    vehicle: '2024 Range Rover Sport',
  },
];

export const SEED_QUOTES: QuoteRequest[] = [
  {
    id: 'RFP-4401',
    status: 'new',
    maskedCustomer: 'Customer ···4521',
    vehicle: '2020 Toyota Land Cruiser',
    insurer: 'AXA Gulf',
    damageSummary: 'Front bumper & left headlight — collision damage, photos attached.',
    mediaCount: 6,
    submittedAt: '2026-08-01T08:15:00+04:00',
    expiresAt: '2026-08-02T08:15:00+04:00',
  },
  {
    id: 'RFP-4398',
    status: 'new',
    maskedCustomer: 'Customer ···8810',
    vehicle: '2019 Mercedes E-Class',
    insurer: 'Sukoon',
    damageSummary: 'Rear quarter panel dent + paint scratch. Towing requested.',
    mediaCount: 4,
    submittedAt: '2026-07-31T19:40:00+04:00',
    expiresAt: '2026-08-01T19:40:00+04:00',
  },
  {
    id: 'RFP-4380',
    status: 'responded',
    maskedCustomer: 'Customer ···2203',
    vehicle: '2022 Nissan Altima',
    insurer: undefined,
    damageSummary: 'Side door scrape (passenger). Self-pay.',
    mediaCount: 3,
    submittedAt: '2026-07-30T11:00:00+04:00',
    expiresAt: '2026-08-01T11:00:00+04:00',
    myQuote: {
      priceAed: 1850,
      etaDays: 3,
      pickup: true,
      notes: 'OEM paint match included. Free pickup within Dubai.',
    },
  },
  {
    id: 'RFP-4355',
    status: 'won',
    maskedCustomer: 'Omar Hassan',
    vehicle: '2019 Nissan Patrol',
    insurer: 'Oman Insurance',
    damageSummary: 'Front grille + radiator support. Claim-linked.',
    mediaCount: 8,
    submittedAt: '2026-07-20T09:00:00+04:00',
    expiresAt: '2026-07-22T09:00:00+04:00',
    myQuote: {
      priceAed: 6200,
      etaDays: 7,
      pickup: true,
      notes: 'Insurer-approved estimate. OEM parts.',
    },
  },
  {
    id: 'RFP-4340',
    status: 'lost',
    maskedCustomer: 'Customer ···1199',
    vehicle: '2021 Audi Q7',
    insurer: 'AXA Gulf',
    damageSummary: 'Hood & windshield replacement after hail.',
    mediaCount: 5,
    submittedAt: '2026-07-15T14:00:00+04:00',
    expiresAt: '2026-07-17T14:00:00+04:00',
    myQuote: {
      priceAed: 9800,
      etaDays: 10,
      pickup: false,
      notes: 'Glass lead time 5 days.',
    },
  },
];

export const SEED_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    customerName: 'Ahmed Mansoor',
    rating: 5,
    comment: 'Quick oil change, fair price, clean workshop. Will book again.',
    createdAt: '2026-07-25T18:00:00+04:00',
    serviceName: 'Standard Oil Change',
    response: 'Thanks Ahmed — appreciate the kind words!',
  },
  {
    id: 'rev-2',
    customerName: 'Priya Sharma',
    rating: 5,
    comment: 'Tire balance was perfect. Staff explained everything clearly.',
    createdAt: '2026-07-26T16:30:00+04:00',
    serviceName: 'Tire Rotation & Balance',
  },
  {
    id: 'rev-3',
    customerName: 'Fatima Al Zaabi',
    rating: 4,
    comment: 'Great work on the brakes. Waiting area could use better Wi-Fi.',
    createdAt: '2026-07-22T12:00:00+04:00',
    serviceName: 'Brake Pad Replacement (Front)',
  },
  {
    id: 'rev-4',
    customerName: 'James Wright',
    rating: 5,
    comment: 'AC fixed same day in this heat — lifesaver!',
    createdAt: '2026-07-18T20:00:00+04:00',
    serviceName: 'AC System Recharge',
  },
];

export const SEED_PAYOUTS: Payout[] = [
  {
    id: 'pay-1',
    amountAed: 108,
    jobRef: 'GG-87550',
    status: 'paid',
    createdAt: '2026-07-27T10:00:00+04:00',
    description: 'Oil Change — Ahmed Mansoor',
  },
  {
    id: 'pay-2',
    amountAed: 72,
    jobRef: 'GG-87551',
    status: 'paid',
    createdAt: '2026-07-28T10:00:00+04:00',
    description: 'Tire Rotation — Priya Sharma',
  },
  {
    id: 'pay-3',
    amountAed: 5580,
    jobRef: 'RFP-4355',
    status: 'held',
    createdAt: '2026-07-29T09:00:00+04:00',
    description: 'Accident repair escrow — Patrol',
  },
  {
    id: 'pay-4',
    amountAed: 315,
    jobRef: 'GG-87640',
    status: 'pending',
    createdAt: '2026-08-01T08:00:00+04:00',
    description: 'Brake pads — Fatima Al Zaabi',
  },
];

export const SEED_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-1',
    title: 'Summer AC Check-up',
    serviceId: 'svc-5',
    discountType: 'percentage',
    value: 15,
    startDate: '2026-07-01',
    endDate: '2026-09-30',
    active: true,
  },
  {
    id: 'promo-2',
    title: 'Winter Tire Special',
    serviceId: 'svc-3',
    discountType: 'fixed',
    value: 50,
    startDate: '2026-11-01',
    endDate: '2027-02-28',
    active: true,
  },
  {
    id: 'promo-3',
    title: 'Brake Pad Replacement',
    serviceId: 'svc-2',
    discountType: 'percentage',
    value: 10,
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    active: true,
  },
  {
    id: 'promo-4',
    title: 'Oil Change Express',
    serviceId: 'svc-1',
    discountType: 'fixed',
    value: 20,
    startDate: '2026-07-15',
    endDate: '2026-08-15',
    active: true,
  },
];

export const SEED_KPIS: DashboardKpis = {
  bookingsThisWeek: 34,
  bookingsTrend: 12.5,
  pendingBookings: 8,
  pendingTrend: -5.0,
  averageRating: 4.8,
  ratingTrend: 0.1,
};

function buildCalendarSlots(): CalendarSlot[] {
  const slots: CalendarSlot[] = [];
  const days = ['2026-08-03', '2026-08-04', '2026-08-05', '2026-08-06'];
  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  const booked = new Set(['2026-08-03-9', '2026-08-03-14', '2026-08-05-13']);
  const blocked = new Set(['2026-08-04-11']);
  const conflict = new Set(['2026-08-05-14']);

  for (const date of days) {
    for (const hour of hours) {
      const key = `${date}-${hour}`;
      let status: CalendarSlot['status'] = 'available';
      if (booked.has(key)) status = 'booked';
      else if (blocked.has(key)) status = 'blocked';
      else if (conflict.has(key)) status = 'conflict';
      slots.push({ date, hour, status });
    }
  }
  return slots;
}

export const SEED_SLOTS = buildCalendarSlots();

export const SELECTED_CATALOG_IDS = [
  'oil',
  'tire',
  'diag',
  'brake',
  'ac',
  'battery',
  'body',
  'wash',
];
