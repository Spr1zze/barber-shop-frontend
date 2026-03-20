import { getSalonFromCache } from '@/features/salons/cache/salonCache';
import { preloadSalonById } from '@/features/salons/services/preloadSalonById';

export async function fetchSalonById(salonId: string) {
  const cachedSalon = getSalonFromCache(salonId);

  if (cachedSalon) {
    return cachedSalon;
  }

  return preloadSalonById(salonId);
}
