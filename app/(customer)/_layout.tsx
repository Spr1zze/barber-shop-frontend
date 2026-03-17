import { Slot } from 'expo-router';

import AppLayout from '@/components/AppLayout';

export default function CustomerLayout() {
  return (
    <AppLayout>
      <Slot />
    </AppLayout>
  );
}
