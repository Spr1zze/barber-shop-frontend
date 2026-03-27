import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { useAuth } from "./contexts/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(customer)");
    }
  }, [isAuthenticated, router]);

  const handleLogin = () => {
    const success = login(email, password);

    if (success) {
      setError("");
      return;
    }

    setError("Ugyldig e-mail eller adgangskode.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log ind</Text>
      <Text style={styles.subtitle}>
        Brug en af projektets demobrugere for at teste bookingflowet.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Adgangskode"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log ind</Text>
      </Pressable>

      <View style={styles.hintContainer}>
        <Text style={styles.hintTitle}>Demo-login</Text>
        <Text style={styles.hint}>Kunde: customer@example.com / customer123</Text>
        <Text style={styles.hint}>Admin: admin@example.com / admin123</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    marginBottom: 24,
    textAlign: "center",
    color: "#666",
    fontSize: 14,
    lineHeight: 20,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  error: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },
  hintContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#e8f4f8",
    borderRadius: 8,
  },
  hintTitle: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  hint: {
    color: "#666",
    fontSize: 12,
    marginTop: 2,
  },
});
