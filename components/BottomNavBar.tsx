import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NAV_ITEMS = [
  { label: 'Udforsk', href: '/', icon: 'search', iconOutline: 'search-outline' },
  { label: 'Bookinger', href: '/bookings', icon: 'calendar', iconOutline: 'calendar-outline' },
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
        const color = isActive ? '#19181d' : '#a7a2ad';

        return (
          <Pressable
            key={item.href}
            onPress={() => !isActive && router.replace(item.href)}
            style={[styles.item, isActive && styles.itemActive]}
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
    borderTopWidth: 1,
    borderColor: '#ece8e2',
    paddingTop: 6,
    paddingHorizontal: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 7,
    borderRadius: 16,
  },
  itemActive: {
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
});
