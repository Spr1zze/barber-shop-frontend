import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Log ind eller opret bruger</Text>
          <Text style={styles.subtitle}>
            Du skal være logget ind for at færdiggøre din booking.
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9}>
            <Text style={styles.primaryButtonText}>Log ind</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.9}>
            <Text style={styles.secondaryButtonText}>Opret bruger</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
          <Text style={styles.backText}>Tilbage</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 32,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '800',
    color: '#17171d',
    letterSpacing: -1.1,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 17,
    lineHeight: 25,
    color: '#77707b',
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#17171d',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  secondaryButton: {
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#f5f2ee',
    borderWidth: 1,
    borderColor: '#ebe5de',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#17171d',
  },
  backText: {
    fontSize: 15,
    color: '#7c7580',
    fontWeight: '600',
  },
});
