import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function ProfileScreen() {
  const { user, isAdmin, isCustomer } = useAuth();

  if (isAdmin) {
    return <AdminProfile user={user} />;
  }

  return <CustomerProfile user={user} />;
}

function CustomerProfile({ user }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Profile</Text>
      <Text style={styles.info}>Name: {user?.name}</Text>
      <Text style={styles.info}>Email: {user?.email}</Text>
      {/* Customer-specific content */}
    </View>
  );
}

function AdminProfile({ user }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.info}>Name: {user?.name}</Text>
      <Text style={styles.info}>Email: {user?.email}</Text>
      {/* Admin-specific content */}
      <View style={styles.adminSection}>
        <Text style={styles.sectionTitle}>Admin Controls</Text>
        <Pressable
          onPress={() => {
            console.log("Adding new barber..."); // Debug log
          }}
          style={styles.menuButton}
        >
          <Text style={styles.buttonText}>Tilføj ny frisør</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            console.log("Removing barber..."); // Debug log
          }}
          style={styles.menuButton}
        >
          <Text style={styles.buttonText}>Fjern frisør</Text>
        </Pressable>
        {/* Admin features here */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  menuButton: {
    backgroundColor: "#007AFF",
    width: "25%",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
  adminSection: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
