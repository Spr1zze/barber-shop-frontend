import { StyleSheet, Text, View } from 'react-native';

export default function BookingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mine bookinger</Text>
      <Text style={styles.subtitle}>Dine kommende bookinger vises her.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#17171c',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#807a86',
    textAlign: 'center',
  },
});
