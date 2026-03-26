import { API_BASE_URL } from '@/features/salons/lib/GetApiBaseURL';
import { ApiError, createApiError } from '@/features/salons/lib/apiError';
import type { SalonBarber } from '@/features/salons/types/salon';

function isSalonBarberArray(payload: unknown): payload is SalonBarber[] {
  return Array.isArray(payload);
}

function normalizeBarbersPayload(payload: unknown): SalonBarber[] {
  if (isSalonBarberArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    const sources: unknown[] = [];
    const root = payload as Record<string, unknown>;

    if (root.barbers) {
      sources.push(root.barbers);
    }

    if (root.data) {
      sources.push(root.data);
    }

    if (root.items) {
      sources.push(root.items);
    }

    if (root.results) {
      sources.push(root.results);
    }

    for (const candidate of sources) {
      if (isSalonBarberArray(candidate)) {
        return candidate;
      }

      if (candidate && typeof candidate === 'object') {
        const nested = candidate as Record<string, unknown>;
        if (isSalonBarberArray(nested.barbers)) {
          return nested.barbers;
        }
      }
    }
  }

  return [];
}

export async function loadSalonBarbers(salonId: string): Promise<SalonBarber[]> {
  const url = `${API_BASE_URL}/salons/${salonId}/barbers`;

  console.log('[salons] loadSalonBarbers request', { salonId, url });

  let response: Response;

  try {
    response = await fetch(url);
  } catch (error) {
    console.error('[salons] loadSalonBarbers network error', { salonId, url, error });
    throw new ApiError(`Network request failed for ${url}`, undefined, error);
  }

  console.log('[salons] loadSalonBarbers response', {
    salonId,
    url,
    status: response.status,
    ok: response.ok,
  });

  if (!response.ok) {
    throw await createApiError(response, `Failed to load barbers for "${salonId}" from ${url}.`);
  }

  const payload = await response.json();
  const barbers = normalizeBarbersPayload(payload);

  if (!barbers.length && !isSalonBarberArray(payload)) {
    console.warn('[salons] loadSalonBarbers unexpected payload shape', {
      salonId,
      url,
      payload,
    });
  }

  console.log('[salons] loadSalonBarbers success', {
    salonId,
    url,
    count: barbers.length,
  });

  return barbers;
}
