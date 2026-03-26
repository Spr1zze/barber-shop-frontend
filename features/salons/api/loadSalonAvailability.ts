import { API_BASE_URL } from '@/features/salons/lib/GetApiBaseURL';
import { ApiError, createApiError } from '@/features/salons/lib/apiError';
import type { SalonAvailabilitySlot } from '@/features/salons/types/salon';

export interface LoadSalonAvailabilityParams {
  salonId: string;
  barberId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD in salon's timezone
}

export async function loadSalonAvailability({
  salonId,
  barberId,
  serviceId,
  date,
}: LoadSalonAvailabilityParams): Promise<SalonAvailabilitySlot[]> {
  const query = `barberId=${encodeURIComponent(barberId)}&serviceId=${encodeURIComponent(serviceId)}&date=${encodeURIComponent(date)}`;
  const url = `${API_BASE_URL}/salons/${salonId}/availability?${query}`;

  console.log('[salons] loadSalonAvailability request', {
    salonId,
    barberId,
    serviceId,
    date,
    url,
  });

  let response: Response;

  try {
    response = await fetch(url);
  } catch (error) {
    console.error('[salons] loadSalonAvailability network error', {
      salonId,
      barberId,
      serviceId,
      date,
      url,
      error,
    });
    throw new ApiError(`Network request failed for ${url}`, undefined, error);
  }

  console.log('[salons] loadSalonAvailability response', {
    salonId,
    barberId,
    serviceId,
    date,
    url,
    status: response.status,
    ok: response.ok,
  });

  if (!response.ok) {
    throw await createApiError(
      response,
      `Failed to load availability for barber "${barberId}" on ${date}.`
    );
  }

  const slots = (await response.json()) as SalonAvailabilitySlot[];

  console.log('[salons] loadSalonAvailability success', {
    salonId,
    barberId,
    serviceId,
    date,
    slotCount: slots.length,
  });

  return slots;
}
