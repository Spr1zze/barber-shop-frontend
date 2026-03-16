import { View, Text, StyleSheet } from 'react-native'

export default function SalonList() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saloner nær dig</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', },
})
