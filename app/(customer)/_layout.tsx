import { Redirect, Slot } from "expo-router";
import { StyleSheet, View } from "react-native";
import BottomNavbar from "../../components/BottomNavBar"; // Adjust path if needed
import TopBar from "../../components/TopBar";
import { useAuth } from "../contexts/AuthContext";

export default function CustomerLayout() {
  const { isAuthenticated } = useAuth();

  // Protect this route group
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <View style={styles.container}>
      <TopBar />
      <View style={styles.content}>
        <Slot /> {/* This renders your pages */}
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
