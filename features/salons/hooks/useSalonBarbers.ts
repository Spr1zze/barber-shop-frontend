import { useEffect, useState } from 'react';

import { loadSalonBarbers } from '@/features/salons/api/loadSalonBarbers';
import { getBarbersFromCache, setBarbersInCache } from '@/features/salons/cache/barbersCache';
import type { SalonBarber } from '@/features/salons/types/salon';

export function useSalonBarbers(salonId: string | null) {
  const [barbers, setBarbers] = useState<SalonBarber[]>(() =>
    salonId ? getBarbersFromCache(salonId) ?? [] : []
  );
  const [isLoading, setIsLoading] = useState(() =>
    salonId ? !getBarbersFromCache(salonId) : false
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!salonId) {
      setBarbers([]);
      setIsLoading(false);
      setError('Missing salon id.');
      return;
    }

    let isActive = true;
    const cachedBarbers = getBarbersFromCache(salonId);

    if (cachedBarbers) {
      setBarbers(cachedBarbers);
      setIsLoading(false);
      setError(null);
    } else {
      setIsLoading(true);
      setError(null);
    }

    loadSalonBarbers(salonId)
      .then(entries => {
        if (!isActive) {
          return;
        }

        const nextBarbers = setBarbersInCache(salonId, entries);
        setBarbers(nextBarbers);
        setIsLoading(false);
      })
      .catch(nextError => {
        if (!isActive) {
          return;
        }

        setError(nextError instanceof Error ? nextError.message : 'Unable to load barbers.');
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [salonId]);

  return { barbers, isLoading, error };
}
