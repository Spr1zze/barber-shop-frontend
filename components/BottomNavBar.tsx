import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NAV_ITEMS = [
  { label: 'Saloner', href: '/', icon: 'home', iconOutline: 'home-outline' },
  { label: 'Mine bookinger', href: '/bookings', icon: 'calendar', iconOutline: 'calendar-outline' },
  { label: 'Profil', href: '/profile', icon: 'person', iconOutline: 'person-outline' },
] as const;

export default function BottomNavBar() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        const color = isActive ? '#2596be' : '#9ca3af';

        return (
          <Pressable
            key={item.href}
            onPress={() => !isActive && router.replace(item.href)}
            style={styles.item}
          >
            <Ionicons
              name={isActive ? item.icon : item.iconOutline}
              size={22}
              color={color}
            />
            <Text style={[styles.label, { color }]} numberOfLines={1}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 14,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
});