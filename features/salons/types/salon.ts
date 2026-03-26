export interface SalonTreatment {
  id: string;
  name: string;
  duration: string;
  price: string;
}

export interface SalonBarber {
  id: string;
  name: string;
  title?: string;
  avatarUrl?: string;
  specialties?: string[];
}

export interface SalonOpeningHour {
  day: string;
  hours: string;
}

export interface SalonContact {
  phone: string;
  email: string;
  address: string;
}

export interface SalonData {
  id: string;
  name: string;
  status: string;
  address: string;
  heroImageUrl: string;
  galleryCountLabel: string;
  description: string;
  contact: SalonContact;
  openingHours: SalonOpeningHour[];
  treatments: SalonTreatment[];
}

export interface SalonAvailabilitySlot {
  start: string;
  end: string;
  durationMinutes: number;
}

export interface SalonBookingPayload {
  serviceId: string;
  barberId: string;
  start: string; // RFC3339 timestamp in Europe/Copenhagen
}

export interface SalonBookingResponse {
  id: string;
  barberId: string;
  barberName: string;
  serviceId: string;
  serviceName: string;
  start: string;
  end?: string;
  durationMinutes: number;
  price: number;
}

export interface BackendSalonOpeningHour {
  day: string;
  order: number;
  open?: string;
  close?: string;
  closed: boolean;
}

export interface BackendSalonTreatment {
  id: string;
  name: string;
  durationMinutes: number;
  priceFrom: number;
}

export interface BackendSalonData {
  id: string;
  name: string;
  address: string;
  description: string;
  heroImageUrl: string;
  phone: string;
  email: string;
  openingHours: BackendSalonOpeningHour[];
  treatments: BackendSalonTreatment[];
}
