import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import Logo from '@/assets/images/icon.png';

export default function TopBar() {
  return (
    <View style={styles.topbar}>
      <Image source={Logo} style={styles.logo} />

      <Pressable onPress={() => console.log('menu')} style={styles.menuButton}>
        <Ionicons name="menu-outline" size={28} color="#5a5561" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 6,
    paddingBottom: 14,
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 112,
    height: 38,
    resizeMode: 'contain',
  },
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ece8e2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 3,
  },
});
