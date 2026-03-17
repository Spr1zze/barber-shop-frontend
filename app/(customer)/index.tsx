import { StyleSheet, Text, View } from 'react-native';

import SearchBar from '@/components/SearchBar';

export default function SalonList() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saloner nær dig</Text>
      <SearchBar onSearch={(text) => console.log(text)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2b2b2b',
    marginBottom: 12,
  },
});
