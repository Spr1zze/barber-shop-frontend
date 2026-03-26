export class ApiError extends Error {
  status?: number;
  details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export async function createApiError(response: Response, fallbackMessage?: string) {
  let details: unknown = null;
  let message = fallbackMessage ?? `Request failed (${response.status}).`;

  try {
    const asJson = await response.clone().json();
    details = asJson;

    if (
      asJson &&
      typeof asJson === 'object' &&
      'message' in asJson &&
      typeof (asJson as { message?: string }).message === 'string'
    ) {
      const nextMessage = (asJson as { message?: string }).message?.trim();
      if (nextMessage) {
        message = nextMessage;
      }
    } else if (typeof asJson === 'string' && asJson.trim().length > 0) {
      message = asJson.trim();
    }
  } catch {
    try {
      const text = await response.text();
      if (text.trim().length > 0) {
        details = text;
        message = text.trim();
      }
    } catch {
      // No-op on parsing errors.
    }
  }

  return new ApiError(message, response.status, details);
}
