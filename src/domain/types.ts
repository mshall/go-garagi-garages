/** Shared domain types — platform-agnostic for React Native reuse */

export type GarageStatus = 'draft' | 'pending' | 'live' | 'rejected' | 'suspended';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'rejected'
  | 'rescheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type QuoteStatus = 'new' | 'responded' | 'won' | 'lost';

export type SlotStatus = 'available' | 'booked' | 'blocked' | 'conflict';

export type DiscountType = 'percentage' | 'fixed';

export interface OperatingHours {
  day: string;
  open: boolean;
  start: string;
  end: string;
}

export interface GarageProfile {
  id: string;
  name: string;
  ownerName: string;
  whatsapp: string;
  phone?: string;
  email?: string;
  description: string;
  address: string;
  city: string;
  lat?: number;
  lng?: number;
  status: GarageStatus;
  rating: number;
  reviewCount: number;
  insurers: string[];
  gallery: string[];
  mainImage?: string;
  tradeLicenseUploaded: boolean;
  hours: OperatingHours[];
  submittedOn?: string;
}

export interface ServiceOffering {
  id: string;
  name: string;
  category: string;
  durationMinutes: number;
  priceAed: number;
  compareAtAed?: number;
  active: boolean;
}

export interface Booking {
  id: string;
  customerName: string;
  customerInitials: string;
  serviceName: string;
  scheduledAt: string;
  status: BookingStatus;
  notes?: string;
  vehicle?: string;
  rejectionReason?: string;
}

export interface QuoteRequest {
  id: string;
  status: QuoteStatus;
  maskedCustomer: string;
  vehicle: string;
  insurer?: string;
  damageSummary: string;
  mediaCount: number;
  submittedAt: string;
  expiresAt: string;
  myQuote?: {
    priceAed: number;
    etaDays: number;
    pickup: boolean;
    notes: string;
  };
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  response?: string;
  serviceName: string;
}

export interface Payout {
  id: string;
  amountAed: number;
  jobRef: string;
  status: 'pending' | 'paid' | 'held';
  createdAt: string;
  description: string;
}

export interface Promotion {
  id: string;
  title: string;
  serviceId: string;
  discountType: DiscountType;
  value: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

export interface CalendarSlot {
  date: string;
  hour: number;
  status: SlotStatus;
}

export interface DashboardKpis {
  bookingsThisWeek: number;
  bookingsTrend: number;
  pendingBookings: number;
  pendingTrend: number;
  averageRating: number;
  ratingTrend: number;
}

export interface CatalogService {
  id: string;
  name: string;
  icon: string;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  initials: string;
}
