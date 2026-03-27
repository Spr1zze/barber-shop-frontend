import { API_BASE_URL } from '@/features/salons/lib/GetApiBaseURL';

import type { BackendSalonData, BackendSalonOpeningHour, BackendSalonTreatment, SalonData } from '@/features/salons/types/salon';

const WEEKDAY_ORDER = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];

function formatTime(value?: string) {
  if (!value) {
    return '';
  }

  return value.slice(0, 5).replace(':', '.');
}

function formatPrice(priceFrom: number) {
  return `Fra ${priceFrom} kr.`;
}

function formatDuration(durationMinutes: number) {
  return `${durationMinutes} min.`;
}

function formatOpeningHours(entry: BackendSalonOpeningHour) {
  if (entry.closed || !entry.open || !entry.close) {
    return 'Lukket';
  }

  return `${formatTime(entry.open)} - ${formatTime(entry.close)}`;
}

function buildStatus(openingHours: BackendSalonOpeningHour[]) {
  const todayName = WEEKDAY_ORDER[new Date().getDay()];
  const todayHours = openingHours.find(entry => entry.day === todayName);

  if (!todayHours) {
    return 'Se åbningstider nedenfor';
  }

  if (todayHours.closed || !todayHours.open || !todayHours.close) {
    return 'Lukket i dag';
  }

  return `Åbent i dag · ${formatOpeningHours(todayHours)}`;
}

function mapTreatment(treatment: BackendSalonTreatment) {
  return {
    id: treatment.id,
    name: treatment.name,
    duration: formatDuration(treatment.durationMinutes),
    price: formatPrice(treatment.priceFrom),
  };
}

function mapSalonResponse(salon: BackendSalonData): SalonData {
  const orderedOpeningHours = [...salon.openingHours].sort((left, right) => left.order - right.order);

  return {
    id: salon.id,
    name: salon.name,
    status: buildStatus(orderedOpeningHours),
    address: salon.address,
    heroImageUrl: salon.heroImageUrl,
    galleryCountLabel: '1 / 1',
    description: salon.description,
    contact: {
      phone: salon.phone,
      email: salon.email,
      address: salon.address,
    },
    openingHours: orderedOpeningHours.map(entry => ({
      day: entry.day,
      hours: formatOpeningHours(entry),
    })),
    treatments: salon.treatments.map(mapTreatment),
  };
}

export async function loadSalonById(salonId: string): Promise<SalonData> {
  const url = `${API_BASE_URL}/salons/${salonId}`;

  let response: Response;

  try {
    response = await fetch(url);
  } catch (error) {
    throw new Error(`Network request failed for ${url}`);
  }

  if (!response.ok) {
    throw new Error(`Failed to load salon "${salonId}" from ${url} (${response.status}).`);
  }

  const salon = (await response.json()) as BackendSalonData;

  return mapSalonResponse(salon);
}
