export { useSalonBarbers } from '@/features/salons/hooks/useSalonBarbers';
export { useSalonDetails } from '@/features/salons/hooks/useSalonDetails';
export { fetchSalonById } from '@/features/salons/services/fetchSalonById';
export { preloadSalonById } from '@/features/salons/services/preloadSalonById';
export type {
    SalonAvailabilitySlot, SalonBarber, SalonBookingPayload,
    SalonBookingResponse, SalonContact, SalonData, SalonOpeningHour,
    SalonTreatment
} from '@/features/salons/types/salon';

