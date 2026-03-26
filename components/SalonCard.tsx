import { MaterialIcons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { SalonListItem } from '@/features/salons';

type SalonCardProps = {
  salon: SalonListItem;
  onPress?: () => void;
};

export default function SalonCard({ salon, onPress }: SalonCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image
        source={salon.heroImageUrl ? { uri: salon.heroImageUrl } : require('@/assets/images/DowntownHair.jpeg')}
        style={styles.image}
      />

      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {salon.name}
        </Text>

        <View style={styles.addressRow}>
          <MaterialIcons name="location-on" size={16} color="#666" style={styles.icon} />
          <Text style={styles.address} numberOfLines={2}>
            {salon.address || 'Adresse ikke tilgængelig'}
          </Text>
        </View>

        <Text style={styles.distance}>Se detaljer og tider</Text>
      </View>

      <View style={styles.button}>
        <Text style={styles.buttonText}>Se tider</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: 100,
    position: 'relative',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  icon: {
    marginRight: 6,
    marginTop: 1,
  },
  address: {
    fontSize: 15,
    color: '#666',
    flex: 1,
    lineHeight: 20,
  },
  distance: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
    marginTop: 2,
  },
  button: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#18AE9F',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
});
