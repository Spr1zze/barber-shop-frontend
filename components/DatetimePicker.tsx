import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

const ACCENT = '#8A7F75';

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
}

export default function DateTimePicker({ onSelect }: Props) {
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

  const actionText = selectedDate && selectedTime ? 'Skift tid' : 'Vælg tid';

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={[styles.trigger, open && styles.triggerOpen]}
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
              color="#6D6D6D"
              style={{ marginTop: 1 }}
            />
          </View>
        </View>

        {selectedDate && selectedTime ? (
          <View style={styles.summaryBlock}>
            <Text style={styles.summaryDate}>
              {formattedSelectedDate}, {selectedTime}
            </Text>
          </View>
        ) : (
          <View style={styles.summaryBlock}>
            <Text style={styles.emptyText}>Ingen tid valgt</Text>
          </View>
        )}
      </TouchableOpacity>

      {open && (
        <View style={styles.panel}>
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
    marginBottom: 14,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#d7e5ec',
  },

  trigger: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },

  triggerOpen: {
    paddingBottom: 0,
  },

  triggerTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  triggerLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: 'rgb(178, 206, 219, 14%)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  triggerEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7b7066',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  triggerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  triggerActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f5f7a',
  },

  summaryBlock: {
    marginTop: 12,
    paddingLeft: 0,
  },

  summaryDate: {
    fontSize: 14,
    color: '#5D5751',
  },

  emptyText: {
    fontSize: 14,
    color: '#6b6f73',
  },

  panel: {
    marginTop: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingTop: 14,
    paddingBottom: 16,
  },

  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },

  monthLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F1F1F',
    letterSpacing: -0.2,
  },

  arrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f9fc',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d4e6ef',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },

  dayHeader: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontSize: 11,
    color: '#8B847D',
    marginBottom: 8,
    fontWeight: '600',
  },

  cell: {
    width: `${100 / 7}%`,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginBottom: 2,
  },

  cellAvailable: {
    backgroundColor: '#f3f9fc',
  },

  cellSelected: {
    backgroundColor: ACCENT,
  },

  dayText: {
    fontSize: 14,
    color: '#232323',
    fontWeight: '500',
  },

  dayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  dayTextFaded: {
    color: '#b7bec4',
  },

  dot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    marginTop: 4,
  },

  dotGreen: {
    backgroundColor: '#4C8C68',
  },

  dotGrey: {
    backgroundColor: '#c6d1d8',
  },

  dotSelected: {
    backgroundColor: '#FFFFFF',
  },

  times: {
    marginTop: 12,
  },

  divider: {
    height: 1,
    backgroundColor: '#d7e5ec',
    marginBottom: 14,
  },

  noTimesText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#66727b',
  },

  timesRow: {
    gap: 8,
  },

  timeOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#d7e5ec',
  },

  timeOptionSelected: {
    borderBottomColor: ACCENT,
  },

  timeOptionText: {
    fontSize: 13,
    color: '#232323',
    fontWeight: '600',
  },

  timeOptionTextSelected: {
    color: ACCENT,
  },
});
