import { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';

const DAYS_SHORT = ['søn.', 'man.', 'tir.', 'ons.', 'tor.', 'fre.', 'lør.'];
const MONTHS = ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'];
const DAYS_LONG = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
const MONTHS_SHORT = ['jan.', 'feb.', 'mar.', 'apr.', 'maj', 'jun.', 'jul.', 'aug.', 'sep.', 'okt.', 'nov.', 'dec.'];

type Assistant = {
  id: string;
  name: string;
  avatar: string;
  availability: Record<string, string[]>;
};

type SelectedSlot = {
  assistantId: string;
  assistantName: string;
  time: string;
};

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

export default function BookTimeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    treatmentName?: string;
    treatmentDuration?: string;
    treatmentPrice?: string;
  }>();

  const treatmentName = Array.isArray(params.treatmentName) ? params.treatmentName[0] : params.treatmentName || 'HerreKlip';
  const treatmentDuration = Array.isArray(params.treatmentDuration) ? params.treatmentDuration[0] : params.treatmentDuration || '30 min.';
  const treatmentPrice = Array.isArray(params.treatmentPrice) ? params.treatmentPrice[0] : params.treatmentPrice || 'Fra 220 kr.';

  const today = useMemo(() => startOfDay(new Date()), []);
  const [rangeOffset, setRangeOffset] = useState(0);
  const [selectedDateKey, setSelectedDateKey] = useState(toKey(today));
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);

  const assistants = useMemo<Assistant[]>(() => {
    const keys = Array.from({ length: 14 }, (_, index) => toKey(addDays(today, index)));

    return [
      {
        id: 'sofie',
        name: 'Sofie Lund',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&q=80',
        availability: {
          [keys[0]]: [],
          [keys[1]]: ['10.00', '10.30', '11.00'],
          [keys[2]]: [],
          [keys[3]]: ['12.00', '12.30'],
          [keys[4]]: ['09.30'],
          [keys[5]]: [],
          [keys[6]]: [],
          [keys[7]]: ['13.00'],
          [keys[8]]: ['10.15', '11.15'],
          [keys[9]]: [],
          [keys[10]]: ['09.45', '10.45', '11.45'],
          [keys[11]]: ['12.15'],
          [keys[12]]: [],
          [keys[13]]: ['14.15'],
        } as Record<string, string[]>,
      },
      {
        id: 'mads',
        name: 'Mads Nørgaard',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&q=80',
        availability: {
          [keys[0]]: ['11.00', '11.15', '11.30', '11.45', '12.00', '12.15', '12.30', '12.45', '13.00', '13.15', '13.30', '13.45'],
          [keys[1]]: ['10.00', '10.15', '10.30', '11.00', '11.30'],
          [keys[2]]: ['12.00', '12.30', '13.00'],
          [keys[3]]: ['10.30', '11.00', '11.30', '12.00'],
          [keys[4]]: ['09.00', '09.30', '10.00', '10.30'],
          [keys[5]]: ['11.00', '11.30'],
          [keys[6]]: [],
          [keys[7]]: ['14.00', '14.30'],
          [keys[8]]: ['10.00', '10.15', '10.30', '10.45'],
          [keys[9]]: ['11.00', '11.15'],
          [keys[10]]: [],
          [keys[11]]: ['12.30', '12.45', '13.00'],
          [keys[12]]: ['09.30', '09.45', '10.00'],
          [keys[13]]: ['15.00', '15.15'],
        } as Record<string, string[]>,
      },
    ];
  }, [today]);

  const visibleDates = useMemo(
    () => Array.from({ length: 7 }, (_, index) => addDays(today, rangeOffset + index)),
    [today, rangeOffset]
  );

  const selectedDate = useMemo(() => {
    const [year, month, day] = selectedDateKey.split('-').map(Number);
    return new Date(year, month - 1, day);
  }, [selectedDateKey]);

  const hasAnyTimes = (dateKey: string) =>
    assistants.some(assistant => (assistant.availability[dateKey] ?? []).length > 0);

  const firstAvailableDate = useMemo(
    () =>
      Array.from({ length: 21 }, (_, index) => addDays(today, index)).find(date =>
        hasAnyTimes(toKey(date))
      ) ?? today,
    [assistants, today]
  );

  const availableAssistants = useMemo(
    () => assistants.filter(assistant => (assistant.availability[selectedDateKey] ?? []).length > 0),
    [assistants, selectedDateKey]
  );

  const totalSlots = useMemo(
    () => assistants.reduce((sum, assistant) => sum + (assistant.availability[selectedDateKey] ?? []).length, 0),
    [assistants, selectedDateKey]
  );

  const availabilityMessage = totalSlots > 0
    ? `${availableAssistants.length} frisører har tilsammen ${totalSlots} ledige tider.`
    : 'Ingen ledige tider denne dag. Prøv en anden dag eller tryk på første ledige tid.';
  const canGoBack = rangeOffset > 0;
  const selectedDateLabel = formatSelectedDate(selectedDate);
  const selectedBookingLabel = selectedSlot
    ? `${selectedDateLabel} kl. ${selectedSlot.time}`
    : 'Vælg en tid for at fortsætte';

  const openLogin = () => {
    router.push({
      pathname: '/login',
      params: {
        returnTo: '/book-time',
      },
    });
  };

  const jumpToDate = (date: Date) => {
    setSelectedDateKey(toKey(date));
    setRangeOffset(Math.floor(dayDiff(today, date) / 7) * 7);
  };

  useEffect(() => {
    if (!selectedSlot) {
      return;
    }

    const assistant = assistants.find(entry => entry.id === selectedSlot.assistantId);
    const timeSlots = assistant?.availability[selectedDateKey] ?? [];

    if (!timeSlots.includes(selectedSlot.time)) {
      setSelectedSlot(null);
    }
  }, [assistants, selectedDateKey, selectedSlot]);

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

            <Text style={styles.headerTitle}>{treatmentName}</Text>
          </View>

          <Text style={styles.headerMeta}>{treatmentPrice} · {treatmentDuration}</Text>

          <View style={styles.quickRow}>
            <TouchableOpacity style={styles.quickButton} onPress={() => jumpToDate(today)} activeOpacity={0.85}>
              <Text style={styles.quickButtonText}>I dag</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickButton, styles.quickButtonWide]}
              onPress={() => jumpToDate(firstAvailableDate)}
              activeOpacity={0.85}
            >
              <Text style={styles.quickButtonText}>Første ledige tid</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickIconButton, styles.quickIconButtonMuted]}
              onPress={() => canGoBack && setRangeOffset(current => current - 7)}
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
              <Text style={[styles.availabilityInlineTitle, totalSlots === 0 && styles.availabilityInlineTitleMuted]}>
                {totalSlots > 0 ? 'Ledige tider' : 'Ingen ledige tider'}
              </Text>
              <Text style={styles.availabilityInlineText}>{availabilityMessage}</Text>
            </View>
          </View>
        </View>

        <View style={styles.dayStrip}>
          {visibleDates.map(date => {
            const dateKey = toKey(date);
            const isSelected = selectedDateKey === dateKey;
            const isDisabled = !hasAnyTimes(dateKey);

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

        <View style={styles.assistantList}>
          {assistants.map(assistant => {
            const timeSlots = assistant.availability[selectedDateKey] ?? [];

            return (
              <View key={assistant.id} style={styles.assistantSection}>
                <View style={styles.assistantHeader}>
                  <Image source={{ uri: assistant.avatar }} style={styles.assistantAvatar} />

                  <View style={styles.assistantInfo}>
                    <Text style={styles.assistantName}>{assistant.name}</Text>
                    <Text style={styles.assistantMeta}>{treatmentPrice} ({treatmentDuration})</Text>
                    <Text style={styles.assistantStatus}>
                      {timeSlots.length > 0 ? `${timeSlots.length} ledige tider` : 'Ingen ledige tider i dag'}
                    </Text>
                  </View>
                </View>

                {timeSlots.length > 0 ? (
                  <View style={styles.timesGrid}>
                    {timeSlots.map(time => {
                      const isSelected =
                        selectedSlot?.assistantId === assistant.id && selectedSlot.time === time;

                      return (
                        <TouchableOpacity
                          key={`${assistant.id}-${time}`}
                          style={[styles.timeButton, isSelected && styles.timeButtonSelected]}
                          activeOpacity={0.85}
                          onPress={() =>
                            setSelectedSlot({
                              assistantId: assistant.id,
                              assistantName: assistant.name,
                              time,
                            })
                          }
                        >
                          <Text style={[styles.timeButtonText, isSelected && styles.timeButtonTextSelected]}>
                            {time}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : (
                  <View style={styles.unavailableCard}>
                    <Text style={styles.unavailableText}>Ingen ledige tider</Text>
                    <Text style={styles.unavailableSubtext}>Prøv en anden dato eller vælg første ledige tid.</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.bottomBookingBar}>
        <View style={styles.selectionSummary}>
          <Text style={styles.selectionLabel}>Valgt tid</Text>
          <Text style={styles.selectionValue}>{selectedBookingLabel}</Text>
          <Text style={styles.selectionMeta}>
            {selectedSlot ? `${selectedSlot.assistantName} · ${treatmentName}` : 'Ingen tid valgt endnu'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.bookButton, !selectedSlot && styles.bookButtonDisabled]}
          activeOpacity={selectedSlot ? 0.9 : 1}
          disabled={!selectedSlot}
          onPress={openLogin}
        >
          <Text style={styles.bookButtonText}>Book nu</Text>
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
    paddingTop: 6,
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
  assistantList: {
    gap: 18,
    paddingTop: 14,
  },
  assistantSection: {
    gap: 12,
    padding: 16,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#efebf3',
  },
  assistantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  assistantAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#d9dde3',
  },
  assistantInfo: {
    flex: 1,
  },
  assistantName: {
    fontSize: 15,
    color: '#222027',
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  assistantMeta: {
    marginTop: 2,
    fontSize: 11,
    color: '#8b8590',
  },
  assistantStatus: {
    marginTop: 1,
    fontSize: 11,
    color: '#6d6671',
    fontWeight: '500',
  },
  unavailableCard: {
    minHeight: 72,
    borderRadius: 16,
    backgroundColor: '#f4f2f7',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
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
  timesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
