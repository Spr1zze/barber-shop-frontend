import type { SalonData } from '@/features/salons/types/salon';

const salonCache = new Map<string, SalonData>();

export function getSalonFromCache(salonId: string) {
  return salonCache.get(salonId) ?? null;
}

export function setSalonInCache(salon: SalonData) {
  salonCache.set(salon.id, salon);
  return salon;
}
