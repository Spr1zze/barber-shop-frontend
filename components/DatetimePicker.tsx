import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

const ACCENT = '#17171d';

const AVAILABILITY: Record<string, string[]> = {
  '2025-07-03': ['09:00', '11:00', '14:00'],
  '2025-07-04': [],
  '2025-07-07': ['10:00', '13:30', '16:00'],
  '2025-07-08': ['09:30', '15:00'],
  '2025-07-09': [],
  '2025-07-10': ['11:00', '14:00'],
  '2025-07-14': ['09:00', '10:00', '16:30'],
  '2025-07-15': ['13:00'],
  '2025-07-16': [],
  '2025-07-17': ['09:00', '11:30', '15:00'],
};

const DAYS = ['Ma', 'Ti', 'On', 'To', 'Fr', 'Lø', 'Sø'];
const MONTHS = ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'];
const WEEKDAYS_FULL = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];

interface Props {
  onSelect?: (date: string | null, time: string | null) => void;
  variant?: 'default' | 'embedded';
}

export default function DateTimePicker({ onSelect, variant = 'default' }: Props) {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(6);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay + 6) % 7;

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const toKey = (day: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const formatDate = (dateKey: string) => {
    const [y, m, d] = dateKey.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const weekday = WEEKDAYS_FULL[date.getDay()];
    const monthName = MONTHS[m - 1].toLowerCase();

    return `${weekday} ${d}. ${monthName}`;
  };

  const handleDayPress = (day: number) => {
    const key = toKey(day);

    if (selectedDate === key) {
      setSelectedDate(null);
      setSelectedTime(null);
      onSelect?.(null, null);
    } else {
      setSelectedDate(key);
      setSelectedTime(null);
      onSelect?.(key, null);
    }
  };

  const handleTimePress = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) onSelect?.(selectedDate, time);
  };

  const prevMonth = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    onSelect?.(null, null);

    if (month === 0) {
      setMonth(11);
      setYear(y => y - 1);
    } else {
      setMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    onSelect?.(null, null);

    if (month === 11) {
      setMonth(0);
      setYear(y => y + 1);
    } else {
      setMonth(m => m + 1);
    }
  };

  const slots = selectedDate ? (AVAILABILITY[selectedDate] ?? []) : [];

  const formattedSelectedDate = useMemo(() => {
    if (!selectedDate) return null;
    return formatDate(selectedDate);
  }, [selectedDate]);

  const actionText = selectedDate && selectedTime ? 'Skift' : 'Åbn';
  const isEmbedded = variant === 'embedded';

  return (
    <View style={[styles.wrapper, isEmbedded && styles.wrapperEmbedded]}>
      <TouchableOpacity
        style={[
          styles.trigger,
          isEmbedded && styles.triggerEmbedded,
          open && styles.triggerOpen,
          isEmbedded && open && styles.triggerEmbeddedOpen,
        ]}
        onPress={() => setOpen(o => !o)}
        activeOpacity={0.9}
      >
        <View style={styles.triggerTopRow}>
          <View style={styles.triggerLabelRow}>
            <View style={styles.iconBadge}>
              <AntDesign name="calendar" size={14} color={ACCENT} />
            </View>
            <Text style={styles.triggerEyebrow}>Dato & tid</Text>
          </View>

          <View style={styles.triggerAction}>
            <Text style={styles.triggerActionText}>{actionText}</Text>
            <AntDesign
              name={open ? 'up' : 'down'}
              size={11}
              color={isEmbedded ? '#5b5460' : '#6D6D6D'}
              style={{ marginTop: 1 }}
            />
          </View>
        </View>

        {selectedDate && selectedTime ? (
          <View style={styles.summaryBlock}>
            <Text style={styles.summaryLabel}>Valgt tid</Text>
            <Text style={styles.summaryDate}>
              {formattedSelectedDate}, {selectedTime}
            </Text>
          </View>
        ) : (
          <View style={styles.summaryBlock}>
            <Text style={styles.summaryLabel}>Tidspunkt</Text>
            <Text style={styles.emptyText}>Vælg dato og tid</Text>
          </View>
        )}
      </TouchableOpacity>

      {open && (
        <View style={[styles.panel, isEmbedded && styles.panelEmbedded]}>
          <View style={styles.monthRow}>
            <TouchableOpacity onPress={prevMonth} style={styles.arrow}>
              <AntDesign name="left" size={14} color="#1F1F1F" />
            </TouchableOpacity>

            <Text style={styles.monthLabel}>
              {MONTHS[month]} {year}
            </Text>

            <TouchableOpacity onPress={nextMonth} style={styles.arrow}>
              <AntDesign name="right" size={14} color="#1F1F1F" />
            </TouchableOpacity>
          </View>

          <View style={styles.grid}>
            {DAYS.map(d => (
              <Text key={d} style={styles.dayHeader}>
                {d}
              </Text>
            ))}

            {cells.map((day, i) => {
              if (!day) return <View key={`empty-${i}`} style={styles.cell} />;

              const key = toKey(day);
              const inData = key in AVAILABILITY;
              const hasSlots = inData && AVAILABILITY[key].length > 0;
              const isSelected = key === selectedDate;
              const isFullyBooked = inData && !hasSlots;

              return (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.cell,
                    inData && styles.cellAvailable,
                    isSelected && styles.cellSelected,
                  ]}
                  onPress={() => handleDayPress(day)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isSelected && styles.dayTextSelected,
                      isFullyBooked && styles.dayTextFaded,
                    ]}
                  >
                    {day}
                  </Text>

                  {inData && (
                    <View
                      style={[
                        styles.dot,
                        hasSlots ? styles.dotGreen : styles.dotGrey,
                        isSelected && styles.dotSelected,
                      ]}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {selectedDate && (
            <View style={styles.times}>
              <View style={styles.divider} />
              <Text style={styles.timesTitle}>Ledige tider</Text>

              {slots.length > 0 ? (
                <View style={styles.timesRow}>
                  {slots.map(time => {
                    const isSelected = selectedTime === time;

                    return (
                      <TouchableOpacity
                        key={time}
                        style={[styles.timeOption, isSelected && styles.timeOptionSelected]}
                        onPress={() => handleTimePress(time)}
                        activeOpacity={0.85}
                      >
                        <Text
                          style={[
                            styles.timeOptionText,
                            isSelected && styles.timeOptionTextSelected,
                          ]}
                        >
                          {time}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                <Text style={styles.noTimesText}>Ingen ledige tider den dag.</Text>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
    overflow: 'visible',
  },
  wrapperEmbedded: {
    marginBottom: 0,
  },

  trigger: {
    backgroundColor: '#faf7f2',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#efe9e1',
  },

  triggerOpen: {
    borderColor: '#ded6cd',
  },
  triggerEmbedded: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
  },
  triggerEmbeddedOpen: {
    borderWidth: 0,
  },

  triggerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  triggerLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ece5dc',
  },

  triggerEyebrow: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5f5864',
  },

  triggerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  triggerActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#17171d',
  },

  summaryBlock: {
    marginTop: 10,
    paddingLeft: 0,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#938b95',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 2,
  },

  summaryDate: {
    fontSize: 14,
    color: '#211f25',
    fontWeight: '600',
  },

  emptyText: {
    fontSize: 13,
    color: '#76707a',
  },

  panel: {
    marginTop: 10,
    backgroundColor: '#faf7f2',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#efe9e1',
  },
  panelEmbedded: {
    marginTop: 12,
    backgroundColor: '#f4eee6',
    borderColor: '#e9dfd3',
  },

  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },

  monthLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f1e23',
    letterSpacing: -0.2,
  },

  arrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ece5dc',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },

  dayHeader: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontSize: 10,
    color: '#8b8590',
    marginBottom: 8,
    fontWeight: '600',
  },

  cell: {
    width: `${100 / 7}%`,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginBottom: 2,
  },

  cellAvailable: {
    backgroundColor: '#ffffff',
  },

  cellSelected: {
    backgroundColor: '#19181d',
  },

  dayText: {
    fontSize: 13,
    color: '#232228',
    fontWeight: '500',
  },

  dayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  dayTextFaded: {
    color: '#c5c0c8',
  },

  dot: {
    width: 4,
    height: 4,
    borderRadius: 999,
    marginTop: 4,
  },

  dotGreen: {
    backgroundColor: '#5a9a73',
  },

  dotGrey: {
    backgroundColor: '#d2cdd5',
  },

  dotSelected: {
    backgroundColor: '#FFFFFF',
  },

  times: {
    marginTop: 10,
  },

  divider: {
    height: 1,
    backgroundColor: '#f0ece7',
    marginBottom: 12,
  },
  timesTitle: {
    fontSize: 12,
    color: '#6d6672',
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  noTimesText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#7a7480',
  },

  timesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  timeOption: {
    borderWidth: 1,
    borderColor: '#e6dfd6',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
  },

  timeOptionSelected: {
    borderColor: '#19181d',
    backgroundColor: '#19181d',
  },

  timeOptionText: {
    fontSize: 12,
    color: '#232228',
    fontWeight: '600',
  },

  timeOptionTextSelected: {
    color: '#ffffff',
  },
});
