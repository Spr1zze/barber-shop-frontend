import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Logo from '@/assets/images/icon.png';

export default function TopBar() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.topbar, { paddingTop: insets.top }]}>
      <Image source={Logo} style={styles.logo} />
      <Pressable onPress={() => console.log('menu')} style={styles.menuButton}>
        <Ionicons name="menu" size={24} color="#1f2937" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  logo: {
    width: 110,
    height: 36,
    resizeMode: 'contain',
  },
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
});
