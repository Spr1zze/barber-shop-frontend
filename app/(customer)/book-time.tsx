import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { SalonAvailabilitySlot, SalonBarber, SalonTreatment } from '@/features/salons';
import { useSalonBarbers, useSalonDetails } from '@/features/salons';
import { createSalonBooking } from '@/features/salons/api/createSalonBooking';
import { loadSalonAvailability } from '@/features/salons/api/loadSalonAvailability';

const DAYS_SHORT = ['søn.', 'man.', 'tir.', 'ons.', 'tor.', 'fre.', 'lør.'];
const MONTHS = ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'];
const DAYS_LONG = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
const MONTHS_SHORT = ['jan.', 'feb.', 'mar.', 'apr.', 'maj', 'jun.', 'jul.', 'aug.', 'sep.', 'okt.', 'nov.', 'dec.'];
const MAX_LOOKAHEAD_DAYS = 21;

type SelectedSlot = {
  barberId: string;
  barberName: string;
  slot: SalonAvailabilitySlot;
};

type BookTimeSearchParams = {
  salonId?: string | string[];
  treatmentId?: string | string[];
  treatmentName?: string | string[];
  treatmentDuration?: string | string[];
  treatmentPrice?: string | string[];
};

type AvailabilityCache = Record<string, SalonAvailabilitySlot[]>;

function readParam(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function toKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function dayDiff(from: Date, to: Date) {
  const a = startOfDay(from).getTime();
  const b = startOfDay(to).getTime();
  return Math.round((b - a) / 86400000);
}

function formatSelectedDate(date: Date) {
  return `${DAYS_LONG[date.getDay()]} ${date.getDate()}. ${MONTHS_SHORT[date.getMonth()]}`;
}

function buildAvailabilityCacheKey(barberId: string, treatmentId: string, dateKey: string) {
  return `${barberId}::${treatmentId}::${dateKey}`;
}

function formatTimeFromIso(iso: string) {
  const date = new Date(iso);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}.${minutes}`;
}

function formatSlotLong(iso: string) {
  const date = new Date(iso);
  return `${DAYS_LONG[date.getDay()]} d. ${date.getDate()}. ${MONTHS_SHORT[date.getMonth()]} kl. ${formatTimeFromIso(iso)}`;
}

export default function BookTimeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<BookTimeSearchParams>();

  const salonId = readParam(params.salonId);
  const initialTreatmentId = readParam(params.treatmentId);
  const fallbackTreatmentName = readParam(params.treatmentName) ?? 'Behandling';
  const fallbackTreatmentDuration = readParam(params.treatmentDuration) ?? '';
  const fallbackTreatmentPrice = readParam(params.treatmentPrice) ?? '';

  const { salon, isLoading: isSalonLoading, error: salonError } = useSalonDetails(salonId ?? null);
  const { barbers, isLoading: isBarbersLoading, error: barbersError } = useSalonBarbers(salonId ?? null);

  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string | null>(initialTreatmentId);
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [rangeOffset, setRangeOffset] = useState(0);
  const today = useMemo(() => startOfDay(new Date()), []);
  const [selectedDateKey, setSelectedDateKey] = useState(toKey(today));
  const selectedDate = useMemo(() => {
    const [year, month, day] = selectedDateKey.split('-').map(Number);
    return new Date(year, month - 1, day);
  }, [selectedDateKey]);

  const [availabilityCache, setAvailabilityCache] = useState<AvailabilityCache>({});
  const availabilityCacheRef = useRef<AvailabilityCache>({});
  const [availabilityLoadingKey, setAvailabilityLoadingKey] = useState<string | null>(null);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [isSearchingFirstAvailable, setIsSearchingFirstAvailable] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    availabilityCacheRef.current = availabilityCache;
  }, [availabilityCache]);

  useEffect(() => {
    if (!salon) {
      return;
    }

    if (selectedTreatmentId && salon.treatments.some(treatment => treatment.id === selectedTreatmentId)) {
      return;
    }

    setSelectedTreatmentId(salon.treatments[0]?.id ?? null);
  }, [salon, selectedTreatmentId]);

  useEffect(() => {
    if (barbers.length === 0) {
      setSelectedBarberId(null);
      return;
    }

    if (selectedBarberId && barbers.some(barber => barber.id === selectedBarberId)) {
      return;
    }

    setSelectedBarberId(barbers[0].id);
  }, [barbers, selectedBarberId]);

  const selectedTreatment: SalonTreatment | null = useMemo(() => {
    if (!salon || !selectedTreatmentId) {
      return null;
    }

    return salon.treatments.find(treatment => treatment.id === selectedTreatmentId) ?? null;
  }, [salon, selectedTreatmentId]);

  const headerPrice = useMemo(() => {
    if (selectedTreatment?.price) {
      return selectedTreatment.price;
    }

    if (fallbackTreatmentPrice) {
      return fallbackTreatmentPrice;
    }

    return fallbackTreatmentName;
  }, [selectedTreatment?.price, fallbackTreatmentPrice, fallbackTreatmentName]);

  const headerDuration = useMemo(() => {
    if (selectedTreatment?.duration) {
      return selectedTreatment.duration;
    }

    if (fallbackTreatmentDuration) {
      return fallbackTreatmentDuration;
    }

    return 'Vælg behandling';
  }, [selectedTreatment?.duration, fallbackTreatmentDuration]);

  const selectedBarber: SalonBarber | null = useMemo(() => {
    if (!selectedBarberId) {
      return null;
    }

    return barbers.find(barber => barber.id === selectedBarberId) ?? null;
  }, [barbers, selectedBarberId]);

  const visibleDates = useMemo(
    () => Array.from({ length: 7 }, (_, index) => addDays(today, rangeOffset + index)),
    [today, rangeOffset]
  );

  const selectionReady = Boolean(selectedTreatment && selectedBarber && salonId);
  const activeCacheKey = selectionReady && selectedBarber && selectedTreatment
    ? buildAvailabilityCacheKey(selectedBarber.id, selectedTreatment.id, selectedDateKey)
    : null;
  const currentSlots = activeCacheKey ? availabilityCache[activeCacheKey] ?? [] : [];
  const isAvailabilityLoading = activeCacheKey ? availabilityLoadingKey === activeCacheKey : false;

  const fetchAvailabilityForDate = useCallback(
    async (dateKey: string, options: { force?: boolean } = {}) => {
      if (!salonId || !selectedBarber || !selectedTreatment) {
        return [];
      }

      const cacheKey = buildAvailabilityCacheKey(selectedBarber.id, selectedTreatment.id, dateKey);

      if (!options.force && availabilityCacheRef.current[cacheKey]) {
        return availabilityCacheRef.current[cacheKey];
      }

      setAvailabilityLoadingKey(cacheKey);
      setAvailabilityError(null);

      try {
        const slots = await loadSalonAvailability({
          salonId,
          barberId: selectedBarber.id,
          serviceId: selectedTreatment.id,
          date: dateKey,
        });

        setAvailabilityCache(prev => {
          const next = { ...prev, [cacheKey]: slots };
          availabilityCacheRef.current = next;
          return next;
        });

        return slots;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Kunne ikke hente ledige tider.';
        setAvailabilityError(message);
        throw error;
      } finally {
        setAvailabilityLoadingKey(current => (current === cacheKey ? null : current));
      }
    },
    [salonId, selectedBarber, selectedTreatment]
  );

  useEffect(() => {
    if (!selectionReady) {
      return;
    }

    fetchAvailabilityForDate(selectedDateKey).catch(() => {
      // Error state handled separately.
    });
  }, [selectionReady, selectedDateKey, fetchAvailabilityForDate]);

  useEffect(() => {
    if (!selectedSlot) {
      return;
    }

    if (!selectedBarber || selectedSlot.barberId !== selectedBarber.id) {
      setSelectedSlot(null);
      return;
    }

    const stillExists = currentSlots.some(slot => slot.start === selectedSlot.slot.start);

    if (!stillExists) {
      setSelectedSlot(null);
    }
  }, [selectedSlot, selectedBarber, currentSlots]);

  const canGoBack = rangeOffset > 0;
  const selectedDateLabel = formatSelectedDate(selectedDate);
  const availabilityMessage = selectionReady
    ? (isAvailabilityLoading
      ? 'Henter ledige tider...'
      : currentSlots.length > 0
        ? `${currentSlots.length} ledige tider`
        : 'Ingen ledige tider denne dag.')
    : 'Vælg behandling og frisør for at se tider.';
  const selectedBookingLabel = selectedSlot
    ? `${selectedDateLabel} kl. ${formatTimeFromIso(selectedSlot.slot.start)}`
    : 'Vælg en tid for at fortsætte';
  const selectionMeta = selectedSlot
    ? `${selectedSlot.barberName} · ${selectedTreatment?.name ?? fallbackTreatmentName}`
    : selectedTreatment
      ? `${selectedTreatment.duration} · ${selectedTreatment.price}`
      : `${fallbackTreatmentDuration} ${fallbackTreatmentPrice}`.trim();
  const disableFirstAvailable = !selectionReady || isSearchingFirstAvailable;

  const jumpToDate = useCallback((date: Date) => {
    setSelectedDateKey(toKey(date));
    setRangeOffset(Math.floor(dayDiff(today, date) / 7) * 7);
  }, [today]);

  const handleFindFirstAvailable = useCallback(async () => {
    if (disableFirstAvailable) {
      return;
    }

    setIsSearchingFirstAvailable(true);

    try {
      let found = false;

      for (let offset = 0; offset < MAX_LOOKAHEAD_DAYS; offset += 1) {
        const candidateDate = addDays(today, offset);
        const dateKey = toKey(candidateDate);
        const slots = await fetchAvailabilityForDate(dateKey, { force: true });

        if (slots.length > 0) {
          found = true;
          jumpToDate(candidateDate);
          break;
        }
      }

      if (!found) {
        Alert.alert('Ingen ledige tider', 'Ingen tider fundet de næste 21 dage.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Kunne ikke finde ledige tider.';
      Alert.alert('Fejl', message);
    } finally {
      setIsSearchingFirstAvailable(false);
    }
  }, [disableFirstAvailable, today, fetchAvailabilityForDate, jumpToDate]);

  const handleBook = useCallback(async () => {
    if (!selectionReady || !selectedSlot || !selectedBarber || !selectedTreatment) {
      return;
    }

    setIsBooking(true);

    try {
      const refreshedSlots = await fetchAvailabilityForDate(selectedDateKey, { force: true });
      const stillAvailable = refreshedSlots.some(slot => slot.start === selectedSlot.slot.start);

      if (!stillAvailable) {
        setSelectedSlot(null);
        Alert.alert('Tiden er væk', 'Tiden er allerede booket. Vælg en ny tid.');
        return;
      }

      const booking = await createSalonBooking({
        salonId,
        payload: {
          barberId: selectedBarber.id,
          serviceId: selectedTreatment.id,
          start: selectedSlot.slot.start,
        },
      });

      try {
        await fetchAvailabilityForDate(selectedDateKey, { force: true });
      } catch {
        // Ignore refresh errors after booking success.
      }

      setSelectedSlot(null);

      Alert.alert(
        'Booking bekræftet',
        `${booking.serviceName} med ${booking.barberName} ${formatSlotLong(booking.start)}.`,
        [
          {
            text: 'Se bookinger',
            onPress: () => router.push('/bookings'),
          },
          {
            text: 'OK',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Kunne ikke booke tiden.';
      Alert.alert('Kunne ikke booke', message);
    } finally {
      setIsBooking(false);
    }
  }, [selectionReady, selectedSlot, selectedBarber, selectedTreatment, salonId, fetchAvailabilityForDate, selectedDateKey, router]);

  if (!salonId) {
    return (
      <View style={styles.centeredState}>
        <Text style={styles.stateTitle}>Ingen salon valgt</Text>
        <Text style={styles.stateText}>Gå tilbage og vælg en salon for at booke en tid.</Text>
      </View>
    );
  }

  if (isSalonLoading || isBarbersLoading) {
    return (
      <View style={styles.centeredState}>
        <ActivityIndicator size="small" color="#17171d" />
        <Text style={styles.stateTitle}>Henter bookingdata...</Text>
      </View>
    );
  }

  if (salonError || barbersError || !salon) {
    return (
      <View style={styles.centeredState}>
        <Text style={styles.stateTitle}>Kunne ikke hente data</Text>
        <Text style={styles.stateText}>{salonError ?? barbersError ?? 'Ukendt fejl.'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topSection}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.85}>
              <Ionicons name="arrow-back" size={20} color="#2d2930" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>{salon.name}</Text>
          </View>

          <Text style={styles.headerMeta}>
            {headerPrice} · {headerDuration}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vælg behandling</Text>

          <View style={styles.treatmentList}>
            {salon.treatments.map(treatment => {
              const isSelected = treatment.id === selectedTreatment?.id;

              return (
                <TouchableOpacity
                  key={treatment.id}
                  style={[styles.treatmentCard, isSelected && styles.treatmentCardSelected]}
                  onPress={() => setSelectedTreatmentId(treatment.id)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.treatmentName}>{treatment.name}</Text>
                  <Text style={styles.treatmentMeta}>{treatment.duration} · {treatment.price}</Text>
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
          <Text style={styles.sectionTitle}>Vælg frisør</Text>

          {barbers.length === 0 ? (
            <View style={styles.unavailableCard}>
              <Text style={styles.unavailableText}>Ingen frisører tilgængelige</Text>
              <Text style={styles.unavailableSubtext}>Prøv igen senere.</Text>
            </View>
          ) : (
            <View style={styles.barberList}>
              {barbers.map(barber => {
                const isSelected = barber.id === selectedBarberId;

                return (
                  <TouchableOpacity
                    key={barber.id}
                    style={[styles.barberCard, isSelected && styles.barberCardSelected]}
                    onPress={() => setSelectedBarberId(barber.id)}
                    activeOpacity={0.85}
                  >
                    {barber.avatarUrl ? (
                      <Image source={{ uri: barber.avatarUrl }} style={styles.barberAvatar} />
                    ) : (
                      <View style={styles.barberPlaceholderAvatar}>
                        <Ionicons name="person-outline" size={18} color="#7f7984" />
                      </View>
                    )}

                    <View style={styles.barberInfo}>
                      <Text style={styles.barberName}>{barber.name}</Text>
                      {barber.title ? <Text style={styles.barberTitle}>{barber.title}</Text> : null}
                    </View>

                    {isSelected && <Ionicons name="checkmark-circle" size={20} color="#1d1c22" />}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.quickRow}>
            <TouchableOpacity style={styles.quickButton} onPress={() => jumpToDate(today)} activeOpacity={0.85}>
              <Text style={styles.quickButtonText}>I dag</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickButton, styles.quickButtonWide]}
              onPress={handleFindFirstAvailable}
              activeOpacity={disableFirstAvailable ? 1 : 0.85}
              disabled={disableFirstAvailable}
            >
              <Text style={styles.quickButtonText}>
                {isSearchingFirstAvailable ? 'Søger...' : 'Første ledige tid'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickIconButton, styles.quickIconButtonMuted]}
              onPress={() => setRangeOffset(current => Math.max(0, current - 7))}
              activeOpacity={canGoBack ? 0.85 : 1}
              disabled={!canGoBack}
            >
              <Ionicons name="chevron-back" size={18} color={canGoBack ? '#6f6975' : '#d0cad3'} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickIconButton}
              onPress={() => setRangeOffset(current => current + 7)}
              activeOpacity={0.85}
            >
              <Ionicons name="chevron-forward" size={18} color="#2d2930" />
            </TouchableOpacity>
          </View>

          <View style={styles.monthRow}>
            <Text style={styles.monthTitle}>
              {MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </Text>

            <View style={styles.availabilityInline}>
              <Text style={[styles.availabilityInlineTitle, currentSlots.length === 0 && styles.availabilityInlineTitleMuted]}>
                {currentSlots.length > 0 ? 'Ledige tider' : 'Ingen ledige tider'}
              </Text>
              <Text style={styles.availabilityInlineText}>{availabilityMessage}</Text>
            </View>
          </View>
        </View>

        <View style={styles.dayStrip}>
          {visibleDates.map(date => {
            const dateKey = toKey(date);
            const isSelected = selectedDateKey === dateKey;
            const dateCacheKey = selectionReady && selectedBarber && selectedTreatment
              ? buildAvailabilityCacheKey(selectedBarber.id, selectedTreatment.id, dateKey)
              : null;
            const isLoadingDay = dateCacheKey ? availabilityLoadingKey === dateCacheKey : false;
            const cachedSlots = dateCacheKey ? availabilityCache[dateCacheKey] : undefined;
            const isDisabled = Boolean(cachedSlots && cachedSlots.length === 0 && !isLoadingDay);

            return (
              <TouchableOpacity
                key={dateKey}
                style={[
                  styles.dayCard,
                  isSelected && styles.dayCardSelected,
                  isDisabled && styles.dayCardDisabled,
                ]}
                disabled={isDisabled}
                onPress={() => setSelectedDateKey(dateKey)}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.dayNumber,
                    isSelected && styles.dayNumberSelected,
                    isDisabled && styles.dayTextDisabled,
                  ]}
                >
                  {date.getDate()}
                </Text>
                <Text
                  style={[
                    styles.dayLabel,
                    isSelected && styles.dayLabelSelected,
                    isDisabled && styles.dayTextDisabled,
                  ]}
                >
                  {DAYS_SHORT[date.getDay()]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ledige tider</Text>

          {!selectionReady && (
            <View style={styles.unavailableCard}>
              <Text style={styles.unavailableText}>Vælg behandling og frisør</Text>
              <Text style={styles.unavailableSubtext}>Derefter kan du se ledige tider.</Text>
            </View>
          )}

          {selectionReady && isAvailabilityLoading && (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="small" color="#18171d" />
              <Text style={styles.loadingText}>Henter ledige tider...</Text>
            </View>
          )}

          {selectionReady && !isAvailabilityLoading && currentSlots.length === 0 && !availabilityError && (
            <View style={styles.unavailableCard}>
              <Text style={styles.unavailableText}>Ingen ledige tider</Text>
              <Text style={styles.unavailableSubtext}>Prøv en anden dato eller søg efter første ledige tid.</Text>
            </View>
          )}

          {availabilityError && (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{availabilityError}</Text>
            </View>
          )}

          {selectionReady && currentSlots.length > 0 && (
            <View style={styles.timesGrid}>
              {currentSlots.map(slot => {
                const isSelected = selectedSlot?.slot.start === slot.start && selectedSlot?.barberId === selectedBarberId;

                return (
                  <TouchableOpacity
                    key={slot.start}
                    style={[styles.timeButton, isSelected && styles.timeButtonSelected]}
                    activeOpacity={0.85}
                    onPress={() =>
                      selectedBarber &&
                      setSelectedSlot({
                        barberId: selectedBarber.id,
                        barberName: selectedBarber.name,
                        slot,
                      })
                    }
                  >
                    <Text style={[styles.timeButtonText, isSelected && styles.timeButtonTextSelected]}>
                      {formatTimeFromIso(slot.start)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomBookingBar}>
        <View style={styles.selectionSummary}>
          <Text style={styles.selectionLabel}>Valgt tid</Text>
          <Text style={styles.selectionValue}>{selectedBookingLabel}</Text>
          <Text style={styles.selectionMeta}>{selectionMeta || 'Ingen tid valgt endnu'}</Text>
        </View>

        <TouchableOpacity
          style={[styles.bookButton, (!selectedSlot || isBooking) && styles.bookButtonDisabled]}
          activeOpacity={selectedSlot && !isBooking ? 0.9 : 1}
          disabled={!selectedSlot || isBooking}
          onPress={handleBook}
        >
          <Text style={styles.bookButtonText}>{isBooking ? 'Booker...' : 'Book nu'}</Text>
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
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 28,
  },
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 10,
    backgroundColor: '#ffffff',
  },
  stateTitle: {
    fontSize: 18,
    color: '#17171d',
    fontWeight: '700',
    textAlign: 'center',
  },
  stateText: {
    fontSize: 14,
    color: '#7c7580',
    textAlign: 'center',
  },
  topSection: {
    paddingBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    color: '#18171d',
    fontWeight: '800',
    letterSpacing: -0.7,
  },
  headerMeta: {
    marginTop: 8,
    marginLeft: 34,
    fontSize: 13,
    color: '#8a8490',
  },
  section: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1f1c24',
    letterSpacing: -0.3,
    marginBottom: 10,
  },
  treatmentList: {
    gap: 12,
  },
  treatmentCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#efebf3',
    backgroundColor: '#ffffff',
  },
  treatmentCardSelected: {
    borderColor: '#1d1c22',
  },
  treatmentName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f1c24',
  },
  treatmentMeta: {
    marginTop: 4,
    fontSize: 13,
    color: '#6f6a74',
  },
  chooseButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e6e1eb',
  },
  chooseButtonActive: {
    borderColor: '#1d1c22',
    backgroundColor: '#1d1c22',
  },
  chooseButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4b4650',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chooseButtonTextActive: {
    color: '#ffffff',
  },
  barberList: {
    gap: 12,
  },
  barberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#efebf3',
    backgroundColor: '#ffffff',
  },
  barberCardSelected: {
    borderColor: '#1d1c22',
    backgroundColor: '#f5f3fa',
  },
  barberAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#d9dde3',
  },
  barberPlaceholderAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#ece8f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  barberInfo: {
    flex: 1,
  },
  barberName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f1c24',
  },
  barberTitle: {
    fontSize: 12,
    color: '#7a7480',
    marginTop: 2,
  },
  quickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  quickButton: {
    minHeight: 42,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e6e1eb',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickButtonWide: {
    flex: 1,
  },
  quickButtonText: {
    fontSize: 13,
    color: '#332f37',
    fontWeight: '600',
  },
  quickIconButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e6e1eb',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickIconButtonMuted: {
    borderColor: '#ece8f1',
  },
  monthRow: {
    marginTop: 14,
    gap: 6,
  },
  monthTitle: {
    fontSize: 28,
    color: '#18171d',
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  availabilityInline: {
    gap: 2,
  },
  availabilityInlineTitle: {
    fontSize: 12,
    color: '#5f8d4f',
    fontWeight: '700',
  },
  availabilityInlineTitleMuted: {
    color: '#908792',
  },
  availabilityInlineText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#6d6671',
  },
  dayStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
    paddingTop: 12,
    paddingBottom: 4,
  },
  dayCard: {
    flex: 1,
    minWidth: 0,
    minHeight: 68,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#dfdbe4',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCardSelected: {
    backgroundColor: '#1d1c22',
    borderColor: '#1d1c22',
  },
  dayCardDisabled: {
    borderColor: '#ece8f1',
    backgroundColor: '#faf9fc',
  },
  dayNumber: {
    fontSize: 18,
    color: '#242129',
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  dayNumberSelected: {
    color: '#ffffff',
  },
  dayLabel: {
    marginTop: 1,
    fontSize: 10,
    color: '#36313a',
  },
  dayLabelSelected: {
    color: '#ffffff',
  },
  dayTextDisabled: {
    color: '#ddd8df',
  },
  unavailableCard: {
    minHeight: 72,
    borderRadius: 16,
    backgroundColor: '#f4f2f7',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginTop: 10,
  },
  unavailableText: {
    fontSize: 15,
    color: '#9f99a2',
    fontWeight: '500',
  },
  unavailableSubtext: {
    marginTop: 3,
    fontSize: 11,
    color: '#b0aab2',
    textAlign: 'center',
  },
  loadingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#efeaf3',
    paddingVertical: 14,
    marginTop: 10,
  },
  loadingText: {
    fontSize: 14,
    color: '#5a5560',
    fontWeight: '600',
  },
  errorCard: {
    marginTop: 12,
    borderRadius: 14,
    padding: 12,
    backgroundColor: '#fdeceb',
    borderWidth: 1,
    borderColor: '#f8c8c3',
  },
  errorText: {
    fontSize: 13,
    color: '#a83232',
    textAlign: 'center',
  },
  timesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  timeButton: {
    width: '22.8%',
    minHeight: 46,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e7e2ec',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeButtonSelected: {
    backgroundColor: '#1d1c22',
    borderColor: '#1d1c22',
  },
  timeButtonText: {
    fontSize: 13,
    color: '#4d4753',
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  timeButtonTextSelected: {
    color: '#ffffff',
  },
  bottomBookingBar: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderColor: '#ece4da',
    backgroundColor: '#ffffff',
    gap: 12,
  },
  selectionSummary: {
    borderRadius: 18,
    backgroundColor: '#f7f5fa',
    borderWidth: 1,
    borderColor: '#ece8f1',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  selectionLabel: {
    fontSize: 11,
    color: '#857d86',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  selectionValue: {
    marginTop: 6,
    fontSize: 17,
    color: '#18171d',
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  selectionMeta: {
    marginTop: 4,
    fontSize: 13,
    color: '#6d6671',
  },
  bookButton: {
    minHeight: 58,
    borderRadius: 18,
    backgroundColor: '#18171d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonDisabled: {
    backgroundColor: '#d5d1da',
  },
  bookButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '800',
    letterSpacing: -0.2,
  },
});