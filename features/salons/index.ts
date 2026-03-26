export { useSalonBarbers } from '@/features/salons/hooks/useSalonBarbers';
export { useSalonDetails } from '@/features/salons/hooks/useSalonDetails';
export { loadSalonList } from '@/features/salons/api/loadSalonList';
export { fetchSalonById } from '@/features/salons/services/fetchSalonById';
export { preloadSalonById } from '@/features/salons/services/preloadSalonById';
export type {
    SalonAvailabilitySlot, SalonBarber, SalonBookingPayload,
    SalonBookingResponse, SalonContact, SalonData, SalonOpeningHour,
    SalonListItem, SalonTreatment
} from '@/features/salons/types/salon';
