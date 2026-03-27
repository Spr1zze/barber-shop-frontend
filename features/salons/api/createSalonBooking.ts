import { API_BASE_URL } from '@/features/salons/lib/GetApiBaseURL';
import { ApiError, createApiError } from '@/features/salons/lib/apiError';
import type { SalonBookingPayload, SalonBookingResponse } from '@/features/salons/types/salon';

interface CreateSalonBookingParams {
  salonId: string;
  payload: SalonBookingPayload;
}

export async function createSalonBooking({ salonId, payload }: CreateSalonBookingParams): Promise<SalonBookingResponse> {
  const url = `${API_BASE_URL}/salons/${salonId}/bookings`;

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
    throw new ApiError(`Network request failed for ${url}`, undefined, error);
  }

  if (response.status === 409) {
    throw await createApiError(response, 'Tiden er allerede booket.');
  }

  if (response.status === 400) {
    throw await createApiError(response, 'Kunne ikke oprette booking.');
  }

  if (response.status !== 201) {
    throw await createApiError(response, `Failed to create booking (${response.status}).`);
  }

  return (await response.json()) as SalonBookingResponse;
}
