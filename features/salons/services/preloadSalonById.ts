import { loadSalonById } from '@/features/salons/api/loadSalonById';
import { setSalonInCache } from '@/features/salons/cache/salonCache';

export async function preloadSalonById(salonId: string) {
  const salon = await loadSalonById(salonId);
  // return salon;
  return setSalonInCache(salon); // this puts in cache and returns to test without cache just retunr slaon
}
