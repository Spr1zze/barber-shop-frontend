import { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const filters = ['Populære', 'Tilbud', 'DameKlip', 'HerreKlip'];

const treatments = [
  { name: 'HerreKlip', duration: '30 min.', price: 'Fra 220 kr.' },
  { name: 'Skin Fade', duration: '45 min.', price: 'Fra 300 kr.' },
  { name: 'Skæg Trim', duration: '20 min.', price: 'Fra 160 kr.' },
];

const openingHours = [
  { day: 'Mandag', hours: '09.00 - 18.00' },
  { day: 'Tirsdag', hours: '09.00 - 18.00' },
  { day: 'Onsdag', hours: '09.00 - 18.00' },
  { day: 'Torsdag', hours: '09.00 - 19.00' },
  { day: 'Fredag', hours: '09.00 - 18.00' },
  { day: 'Lørdag', hours: '10.00 - 15.00' },
  { day: 'Søndag', hours: 'Lukket' },
];

const WEEKDAYS = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];

export default function BookingsScreen() {
  const router = useRouter();
  const todayName = WEEKDAYS[new Date().getDay()];
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const [selectedTreatment, setSelectedTreatment] = useState(treatments[0]);

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerBlock}>
          <Text style={styles.title}>Downtown Hair</Text>
          <Text style={styles.status}>Åbent nu · lukker kl. 18.00</Text>

          <View style={styles.addressRow}>
            <Text style={styles.address}>Nørregade 14, 1165 København K</Text>

            <TouchableOpacity style={styles.linkButton} activeOpacity={0.8}>
              <Ionicons name="navigate-outline" size={18} color="#6664e8" />
              <Text style={styles.linkText}>Find vej</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.heroSection}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1200&q=80' }}
            style={styles.heroImage}
          />

          <TouchableOpacity style={styles.galleryButton} activeOpacity={0.85}>
            <Ionicons name="grid-outline" size={18} color="#3a3640" />
            <Text style={styles.galleryButtonText}>Se alle billeder</Text>
          </TouchableOpacity>

          <View style={styles.imageCounter}>
            <Text style={styles.imageCounterText}>1 / 1</Text>
          </View>

          <TouchableOpacity style={styles.shareButton} activeOpacity={0.85}>
            <Ionicons name="share-social-outline" size={22} color="#3a3640" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Behandlinger</Text>

          <View style={styles.searchField}>
            <Ionicons name="search-outline" size={22} color="#a7a2ad" />
            <TextInput
              placeholder="Søg i behandlinger"
              placeholderTextColor="#b4afb8"
              style={styles.searchInput}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersRow}
          >
            {filters.map(filter => {
              const isActive = filter === selectedFilter;

              return (
                <TouchableOpacity
                  key={filter}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  onPress={() => setSelectedFilter(filter)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.treatmentList}>
            {treatments.map(treatment => {
              const isSelected = treatment.name === selectedTreatment.name;

              return (
                <TouchableOpacity
                  key={treatment.name}
                  style={[styles.treatmentCard, isSelected && styles.treatmentCardSelected]}
                  onPress={() => setSelectedTreatment(treatment)}
                  activeOpacity={0.85}
                >
                  <View style={styles.treatmentInfo}>
                    <Text style={styles.treatmentName}>{treatment.name}</Text>
                    <Text style={styles.treatmentMeta}>{treatment.duration}</Text>
                    <Text style={styles.treatmentPrice}>{treatment.price}</Text>
                  </View>

                  <View style={[styles.chooseButton, isSelected && styles.chooseButtonActive]}>
                    <Text style={[styles.chooseButtonText, isSelected && styles.chooseButtonTextActive]}>
                      {isSelected ? 'Valgt' : 'Vælg'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Om Downtown Hair</Text>

          <Text style={styles.infoDescription}>
            Downtown Hair er en moderne barbersalon i indre by med fokus på præcise klip,
            rolige omgivelser og en enkel oplevelse fra booking til færdigt resultat. Vi
            arbejder med både klassiske herreklip, fades og skægtrim og lægger vægt på, at
            du får en behandling, der passer til både stil og hverdag.
          </Text>

          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Kontakt</Text>

            <View style={styles.contactRow}>
              <Ionicons name="call-outline" size={18} color="#6e6773" />
              <Text style={styles.contactText}>+45 31 23 45 67</Text>
            </View>

            <View style={styles.contactRow}>
              <Ionicons name="mail-outline" size={18} color="#6e6773" />
              <Text style={styles.contactText}>hej@downtownhair.dk</Text>
            </View>

            <View style={styles.contactRow}>
              <Ionicons name="location-outline" size={18} color="#6e6773" />
              <Text style={styles.contactText}>Nørregade 14, 1165 København K</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Åbningstider</Text>

            <View style={styles.hoursList}>
              {openingHours.map(entry => (
                <View key={entry.day} style={styles.hoursRow}>
                  <Text style={[styles.hoursDay, entry.day === todayName && styles.hoursTodayText]}>
                    {entry.day}
                  </Text>
                  <Text style={[styles.hoursValue, entry.day === todayName && styles.hoursTodayText]}>
                    {entry.hours}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBookingBar}>
        <View style={styles.bottomBookingTextWrap}>
          <Text style={styles.bottomBookingLabel}>Valgt behandling</Text>
          <Text style={styles.bottomBookingTitle}>{selectedTreatment.name}</Text>
          <Text style={styles.bottomBookingMeta}>
            {selectedTreatment.duration} · {selectedTreatment.price}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.bookButton}
          activeOpacity={0.9}
          onPress={() =>
            router.push({
              pathname: '/book-time',
              params: {
                treatmentName: selectedTreatment.name,
                treatmentDuration: selectedTreatment.duration,
                treatmentPrice: selectedTreatment.price,
              },
            })
          }
        >
          <Text style={styles.bookButtonText}>Book tid</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 144,
  },
  headerBlock: {
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#17171d',
    letterSpacing: -1.5,
  },
  status: {
    marginTop: 8,
    fontSize: 15,
    color: '#58a17e',
    fontWeight: '600',
  },
  addressRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
  },
  address: {
    fontSize: 15,
    color: '#7e7884',
    flexShrink: 1,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  linkText: {
    fontSize: 15,
    color: '#6664e8',
    fontWeight: '600',
  },
  heroSection: {
    position: 'relative',
    backgroundColor: '#f6f1ea',
  },
  heroImage: {
    width: '100%',
    height: 292,
    backgroundColor: '#ede7de',
  },
  galleryButton: {
    position: 'absolute',
    left: 20,
    bottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
  },
  galleryButtonText: {
    fontSize: 13,
    color: '#2b2730',
    fontWeight: '700',
  },
  imageCounter: {
    position: 'absolute',
    right: 20,
    bottom: 18,
    backgroundColor: 'rgba(72, 68, 73, 0.75)',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 16,
  },
  imageCounterText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '700',
  },
  shareButton: {
    position: 'absolute',
    right: 20,
    top: 18,
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
  },
  section: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 6,
    backgroundColor: '#ffffff',
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#17171d',
    letterSpacing: -1,
  },
  searchField: {
    marginTop: 18,
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#eeebe6',
    borderRadius: 18,
    backgroundColor: '#ffffff',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1d1c21',
    paddingVertical: 0,
  },
  filtersRow: {
    gap: 10,
    paddingTop: 16,
    paddingBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 999,
    backgroundColor: '#f3f1ee',
  },
  filterChipActive: {
    backgroundColor: '#17171d',
  },
  filterChipText: {
    fontSize: 15,
    color: '#595461',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  treatmentList: {
    marginTop: 10,
    gap: 8,
  },
  treatmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#eeebe6',
    backgroundColor: '#ffffff',
  },
  treatmentCardSelected: {
    borderColor: '#d9d3cc',
    backgroundColor: '#fcfbfa',
  },
  treatmentInfo: {
    flex: 1,
    gap: 2,
  },
  treatmentName: {
    fontSize: 15,
    color: '#17171d',
    fontWeight: '700',
  },
  treatmentMeta: {
    fontSize: 13,
    color: '#97919c',
  },
  treatmentPrice: {
    marginTop: 2,
    fontSize: 13,
    color: '#4a444f',
    fontWeight: '600',
  },
  chooseButton: {
    minWidth: 76,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e3ddd6',
    backgroundColor: '#ffffff',
  },
  chooseButtonActive: {
    backgroundColor: '#17171d',
    borderColor: '#17171d',
  },
  chooseButtonText: {
    fontSize: 13,
    color: '#4b4650',
    fontWeight: '600',
  },
  chooseButtonTextActive: {
    color: '#ffffff',
  },
  infoCard: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f2eeea',
    backgroundColor: '#fdfcfa',
  },
  infoCardTitle: {
    fontSize: 17,
    color: '#17171d',
    fontWeight: '700',
    marginBottom: 12,
  },
  infoDescription: {
    marginTop: 16,
    fontSize: 15,
    lineHeight: 24,
    color: '#59535d',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    paddingVertical: 8,
  },
  contactText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#59535d',
  },
  hoursList: {
    gap: 8,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 3,
  },
  hoursDay: {
    fontSize: 14,
    color: '#6f6873',
    fontWeight: '500',
  },
  hoursValue: {
    fontSize: 14,
    color: '#6f6873',
    fontWeight: '500',
  },
  hoursTodayText: {
    fontSize: 15,
    color: '#17171d',
    fontWeight: '700',
  },
  bottomBookingBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderTopWidth: 1,
    borderTopColor: '#ece8e2',
  },
  bottomBookingTextWrap: {
    flex: 1,
  },
  bottomBookingLabel: {
    fontSize: 11,
    color: '#908993',
    fontWeight: '600',
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  bottomBookingTitle: {
    fontSize: 16,
    color: '#17171d',
    fontWeight: '700',
  },
  bottomBookingMeta: {
    marginTop: 4,
    fontSize: 13,
    color: '#7f7884',
  },
  bookButton: {
    minWidth: 118,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#17171d',
  },
  bookButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '700',
  },
});
