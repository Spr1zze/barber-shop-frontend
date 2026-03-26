import type { SalonBarber } from '@/features/salons/types/salon';

const salonBarbersCache = new Map<string, SalonBarber[]>();

export function getBarbersFromCache(salonId: string) {
  return salonBarbersCache.get(salonId) ?? null;
}

export function setBarbersInCache(salonId: string, barbers: SalonBarber[]) {
  salonBarbersCache.set(salonId, barbers);
  return barbers;
}

export function clearBarbersFromCache() {
  salonBarbersCache.clear();
}
