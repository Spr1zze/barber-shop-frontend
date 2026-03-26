import { API_BASE_URL } from '@/features/salons/lib/GetApiBaseURL';
import { ApiError, createApiError } from '@/features/salons/lib/apiError';
import type { SalonBookingPayload, SalonBookingResponse } from '@/features/salons/types/salon';

interface CreateSalonBookingParams {
  salonId: string;
  payload: SalonBookingPayload;
}

export async function createSalonBooking({ salonId, payload }: CreateSalonBookingParams): Promise<SalonBookingResponse> {
  const url = `${API_BASE_URL}/salons/${salonId}/bookings`;

  console.log('[salons] createSalonBooking request', {
    salonId,
    url,
    payload,
  });

  let response: Response;

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('[salons] createSalonBooking network error', { salonId, url, payload, error });
    throw new ApiError(`Network request failed for ${url}`, undefined, error);
  }

  console.log('[salons] createSalonBooking response', {
    salonId,
    url,
    status: response.status,
    ok: response.ok,
  });

  if (response.status === 409) {
    throw await createApiError(response, 'Tiden er allerede booket.');
  }

  if (response.status === 400) {
    throw await createApiError(response, 'Kunne ikke oprette booking.');
  }

  if (response.status !== 201) {
    throw await createApiError(response, `Failed to create booking (${response.status}).`);
  }

  const booking = (await response.json()) as SalonBookingResponse;

  console.log('[salons] createSalonBooking success', {
    salonId,
    bookingId: booking.id,
  });

  return booking;
}
