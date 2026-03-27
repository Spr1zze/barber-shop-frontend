import { StyleSheet, Text, View } from "react-native";

import { useAuth } from "../contexts/AuthContext";

type ProfileProps = {
  user: {
    name: string;
    email: string;
  } | null;
};

export default function ProfileScreen() {
  const { user, isAdmin } = useAuth();

  if (isAdmin) {
    return <AdminProfile user={user} />;
  }

  return <CustomerProfile user={user} />;
}

function CustomerProfile({ user }: ProfileProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kundeprofil</Text>
      <Text style={styles.info}>Navn: {user?.name}</Text>
      <Text style={styles.info}>E-mail: {user?.email}</Text>
    </View>
  );
}

function AdminProfile({ user }: ProfileProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adminprofil</Text>
      <Text style={styles.info}>Navn: {user?.name}</Text>
      <Text style={styles.info}>E-mail: {user?.email}</Text>

      <View style={styles.adminSection}>
        <Text style={styles.sectionTitle}>Admin</Text>
        <Text style={styles.helperText}>
          Adminværktøjer er ikke en del af demoen endnu.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  helperText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
  },
});
