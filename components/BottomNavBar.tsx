import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type NavItem = {
  label: string;
  href: '/' | '/bookings' | '/profile';
  activeIcon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
};

const navItems: NavItem[] = [
  {
    label: 'Saloner',
    href: '/',
    activeIcon: 'home',
    inactiveIcon: 'home-outline',
  },
  {
    label: 'Mine bookinger',
    href: '/bookings',
    activeIcon: 'calendar',
    inactiveIcon: 'calendar-outline',
  },
  {
    label: 'Profil',
    href: '/profile',
    activeIcon: 'person',
    inactiveIcon: 'person-outline',
  },
];

export default function BottomNavBar() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.navbar}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const color = isActive ? '#2596be' : '#9ca3af';

          return (
            <Pressable
              key={item.href}
              onPress={() => {
                if (!isActive) {
                  router.replace(item.href);
                }
              }}
              style={styles.navItem}>
              <Ionicons
                name={isActive ? item.activeIcon : item.inactiveIcon}
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 28,
    paddingHorizontal: 8,
    paddingVertical: 10,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
});
