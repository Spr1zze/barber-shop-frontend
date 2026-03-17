import { Image, StyleSheet, View } from 'react-native';

import Logo from '@/assets/images/icon.png';

export default function TopBar() {
  return (
    <View style={styles.topbar}>
      <Image source={Logo} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  topbar: {
    height: 72,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  logo: {
    width: 104,
    height: 40,
    resizeMode: 'contain',
  },
});
