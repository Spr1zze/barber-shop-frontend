import { API_BASE_URL } from '@/features/salons/lib/GetApiBaseURL';
import { ApiError } from '@/features/salons/lib/apiError';
import type { SalonListItem } from '@/features/salons/types/salon';

function slugifySalonId(value: string) {
  return value
    .trim()
    .replace(/^salon\s+/i, '')
    .replace(/h\.\s*c\./gi, 'hc')
    .replace(/æ/gi, match => (match === 'Æ' ? 'AE' : 'ae'))
    .replace(/ø/gi, match => (match === 'Ø' ? 'OE' : 'oe'))
    .replace(/å/gi, match => (match === 'Å' ? 'AA' : 'aa'))
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function readString(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function normalizeSalonListPayload(payload: unknown): SalonListItem[] {
  const items = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object'
      ? (['salons', 'data', 'items', 'results']
          .map(key => (payload as Record<string, unknown>)[key])
          .find(candidate => Array.isArray(candidate)) as unknown[] | undefined) ?? []
      : [];

  return items
    .map(entry => {
      if (!entry || typeof entry !== 'object') {
        return null;
      }

      const source = entry as Record<string, unknown>;
      const backendId = readString(source, ['id', 'ID']);
      const name = readString(source, ['name', 'Name', 'title', 'Title']);
      const address = readString(source, ['address', 'Address', 'location', 'Location']) ?? '';
      const slug = readString(source, ['slug', 'Slug', 'salonSlug', 'salon_slug']);
      const heroImageUrl = readString(source, ['heroImageUrl', 'HeroImageUrl', 'imageUrl', 'ImageUrl']);

      if (!name) {
        return null;
      }

      const resolvedSlug = slug ?? slugifySalonId(name);
      const id = backendId ?? resolvedSlug;

      if (!id || !resolvedSlug) {
        return null;
      }

      return {
        id,
        slug: resolvedSlug,
        name,
        address,
        heroImageUrl: heroImageUrl ?? undefined,
      };
    })
    .filter((salon): salon is SalonListItem => Boolean(salon));
}

export async function loadSalonList(): Promise<SalonListItem[]> {
  const url = `${API_BASE_URL}/salon/details`;

  let response: Response;

  try {
    response = await fetch(url);
  } catch (error) {
    throw new ApiError(`Network request failed for ${url}`, undefined, error);
  }

  if (!response.ok) {
    throw new Error(`Failed to load salons from ${url} (${response.status}).`);
  }

  const payload = await response.json();
  return normalizeSalonListPayload(payload);
}
