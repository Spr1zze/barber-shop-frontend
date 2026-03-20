export interface SalonTreatment {
  id: string;
  name: string;
  duration: string;
  price: string;
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
