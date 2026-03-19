import { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import Dropdown from '@/components/Dropdown';
import DateTimePicker from '@/components/DatetimePicker';

const barbers = [
  { name: 'Sofie', icon: { lib: 'image' as const, uri: 'https://i.pravatar.cc/150?img=1' } },
  { name: 'Mattolalalaus', icon: { lib: 'image' as const, uri: 'https://i.pravatar.cc/150?img=3' } },
];
const services = [
  { name: 'Herreklip', icon: { lib: 'ion' as const, name: 'cut-outline' } },
  { name: 'Skæg trim', icon: { lib: 'ion' as const, name: 'happy-outline' } },
  { name: 'Fade', icon: { lib: 'ion' as const, name: 'color-wand-outline' } },
];

export default function BookingsScreen() {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        <Text style={styles.title}>Downtown Hair</Text>
        <View style={styles.holder1}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80' }}
            style={styles.image}
          />
          <View style={styles.textHolder}>
            <View style={styles.oneliner}>
              <View style={styles.leftSubtext}>
                <Entypo name="location-pin" size={22} color="#8A7F75" style={{ width: 20, textAlign: 'center' }} />
                <Text style={styles.subtext}>Nørregade 14</Text>
              </View>
              <View style={styles.rightSubtext}>
                <AntDesign name="clock-circle" size={16} color="#7d7269" style={{ width: 20, textAlign: 'center' }} />
                <Text style={styles.subtext}>Åben til 18:00</Text>
              </View>
            </View>
            <Dropdown title="Frisør" items={barbers} />
            <Dropdown title="Service" items={services} />
          </View>
          <View style={styles.timeHolder}>
            <DateTimePicker onSelect={(_, time) => setSelectedTime(time)} />
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomPanel}>
        <View style={styles.bottomInner}>
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>
              {selectedTime ? `Book tid: ${selectedTime}` : 'Book tid'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 6,
    paddingTop: 8,
    paddingBottom: 120,
  },
  title: {
    marginBottom: 14,
    fontSize: 32,
    fontWeight: '700',
    color: '#2b211a',
    letterSpacing: -0.8,
    textAlign: 'center',
  },
  oneliner: {
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 14,
    justifyContent: 'space-between',
  },
  holder1: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 22,
    marginBottom: 16,
    overflow: 'visible',
    borderWidth: 1,
    borderColor: '#ece2d8',
  },
  bottomPanel: {
    position: 'absolute',
    bottom: -22,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#ece2d8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 10,
    paddingTop: 18,
    paddingBottom: 40,
  },
  bottomInner: {
    paddingHorizontal: 20,
  },
  textHolder: {
    marginTop: 14,
    paddingRight: 16,
    paddingLeft: 16,
    paddingBottom: 6,
    width: '100%',
  },
  subtext: {
    fontSize: 14,
    color: '#5d5751',
    fontWeight: '500',
  },
  image: {
    width: '100%',
    height: 190,
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  leftSubtext: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingRight: 10,
  },
  rightSubtext: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeHolder: {
    marginTop: 6,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  bookButton: {
    backgroundColor: '#3a9a96',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
