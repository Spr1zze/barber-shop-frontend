import { Redirect, Slot } from "expo-router";
import { StyleSheet, View } from "react-native";

import BottomNavbar from "@/components/BottomNavBar";
import TopBar from "@/components/TopBar";
import { useAuth } from "../contexts/AuthContext";

export default function CustomerLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <View style={styles.container}>
      <TopBar />
      <View style={styles.content}>
        <Slot />
      </View>
      <BottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
