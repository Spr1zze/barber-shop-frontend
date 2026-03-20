import { ReactNode } from 'react';
import { usePathname } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomNavBar from '@/components/BottomNavBar';
import TopBar from '@/components/TopBar';

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
<<<<<<< HEAD
    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <View style={styles.container}>
                <TopBar />
                <View style={styles.content}>{children}</View>
                <BottomNavBar />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#e6e6e6',
    },
    container: {
        flex: 1,
        backgroundColor: '#e6e6e6',
    },
    content: {
        flex: 1,
    },
=======
  const pathname = usePathname();
  const hideTopBar = pathname === '/book-time';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {!hideTopBar && <TopBar />}
        <View style={styles.content}>{children}</View>
        <BottomNavBar />
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
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
>>>>>>> e74c13629de0f150b663cfd61bf44d1e1fc32e56
});
