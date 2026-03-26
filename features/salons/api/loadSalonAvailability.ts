import { API_BASE_URL } from '@/features/salons/lib/GetApiBaseURL';
import { ApiError, createApiError } from '@/features/salons/lib/apiError';
import type { SalonAvailabilitySlot } from '@/features/salons/types/salon';

export interface LoadSalonAvailabilityParams {
  salonId: string;
  barberId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD in salon's timezone
}

function isSalonAvailabilitySlotArray(payload: unknown): payload is SalonAvailabilitySlot[] {
  return Array.isArray(payload);
}

function normalizeAvailabilityPayload(payload: unknown): SalonAvailabilitySlot[] {
  if (isSalonAvailabilitySlotArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    const root = payload as Record<string, unknown>;
    const candidates = [root.slots, root.data, root.items, root.results];

    for (const candidate of candidates) {
      if (isSalonAvailabilitySlotArray(candidate)) {
        return candidate;
      }

      if (candidate && typeof candidate === 'object') {
        const nested = candidate as Record<string, unknown>;

        if (isSalonAvailabilitySlotArray(nested.slots)) {
          return nested.slots;
        }
      }
    }
  }

  return [];
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

  const payload = await response.json();
  const slots = normalizeAvailabilityPayload(payload);

  if (!slots.length && !isSalonAvailabilitySlotArray(payload)) {
    console.warn('[salons] loadSalonAvailability unexpected payload shape', {
      salonId,
      barberId,
      serviceId,
      date,
      url,
      payload,
    });
  }

  console.log('[salons] loadSalonAvailability success', {
    salonId,
    barberId,
    serviceId,
    date,
    slotCount: slots.length,
  });

  return slots;
}
