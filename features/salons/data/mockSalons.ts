import type { SalonData } from '@/features/salons/types/salon';

export const MOCK_SALONS: Record<string, SalonData> = {
  'klippekrogen': {
    id: 'klippekrogen',
    name: 'Downtown Hair',
    status: 'Åbent nu · lukker kl. 18.00',
    address: 'Nørregade 14, 1165 København K',
    heroImageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1200&q=80',
    galleryCountLabel: '1 / 1',
    description:
      'Downtown Hair er en moderne barbersalon i indre by med fokus på præcise klip, rolige omgivelser og en enkel oplevelse fra booking til færdigt resultat. Vi arbejder med både klassiske herreklip, fades og skægtrim og lægger vægt på, at du får en behandling, der passer til både stil og hverdag.',
    contact: {
      phone: '+45 31 23 45 67',
      email: 'hej@downtownhair.dk',
      address: 'Nørregade 14, 1165 København K',
    },
    openingHours: [
      { day: 'Mandag', hours: '09.00 - 18.00' },
      { day: 'Tirsdag', hours: '09.00 - 18.00' },
      { day: 'Onsdag', hours: '09.00 - 18.00' },
      { day: 'Torsdag', hours: '09.00 - 19.00' },
      { day: 'Fredag', hours: '09.00 - 18.00' },
      { day: 'Lørdag', hours: '10.00 - 15.00' },
      { day: 'Søndag', hours: 'Lukket' },
    ],
    treatments: [
      { id: 'herreklip', name: 'HerreKlip', duration: '30 min.', price: 'Fra 220 kr.' },
      { id: 'skin-fade', name: 'Skin Fade', duration: '45 min.', price: 'Fra 300 kr.' },
      { id: 'skaeg-trim', name: 'Skæg Trim', duration: '20 min.', price: 'Fra 160 kr.' },
    ],
  },
};
