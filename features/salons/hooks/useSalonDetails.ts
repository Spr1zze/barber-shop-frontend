import { useEffect, useState } from 'react';

import { getSalonFromCache } from '@/features/salons/cache/salonCache';
import { fetchSalonById } from '@/features/salons/services/fetchSalonById';
import type { SalonData } from '@/features/salons/types/salon';

export function useSalonDetails(salonId: string | null) {
  const [salon, setSalon] = useState<SalonData | null>(() =>
    salonId ? getSalonFromCache(salonId) : null
  );
  const [isLoading, setIsLoading] = useState(() =>
    salonId ? !getSalonFromCache(salonId) : false
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!salonId) {
      setSalon(null);
      setIsLoading(false);
      setError('Missing salon id.');
      return;
    }

    let isActive = true;
    const cachedSalon = getSalonFromCache(salonId);

    if (cachedSalon) {
      setSalon(cachedSalon);
      setIsLoading(false);
      setError(null);
    } else {
      setIsLoading(true);
      setError(null);
    }

    fetchSalonById(salonId)
      .then(nextSalon => {
        if (!isActive) {
          return;
        }

        setSalon(nextSalon);
        setIsLoading(false);
      })
      .catch(nextError => {
        if (!isActive) {
          return;
        }

        setError(nextError instanceof Error ? nextError.message : 'Unable to load salon.');
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [salonId]);

  return { salon, isLoading, error };
}
