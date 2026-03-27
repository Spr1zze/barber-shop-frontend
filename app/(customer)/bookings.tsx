import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import HistoryCard from "../../components/HistoryCard";
import { loadHistory } from "../../features/history/api/loadHistory";
import type { History } from "../../features/history/data/historyData";

export default function HistoryPage() {
  const [history, setHistory] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const now = new Date();

  const upcomingHistory = history.filter((item) => new Date(item.datetime) > now);
  const pastHistory = history.filter((item) => new Date(item.datetime) <= now);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadHistory();
        setHistory(data);
        setError(null);
      } catch (nextError) {
        const message =
          nextError instanceof Error ? nextError.message : "Kunne ikke hente dine bookinger.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historik</Text>

      {loading ? (
        <View style={styles.stateCard}>
          <ActivityIndicator size="small" color="#17171d" />
          <Text style={styles.stateText}>Henter bookinger...</Text>
        </View>
      ) : error ? (
        <View style={styles.stateCard}>
          <Text style={styles.stateText}>{error}</Text>
        </View>
      ) : (
        <ScrollView>
          <Text style={styles.sectionTitle}>Kommende tider</Text>
          {upcomingHistory.map((item) => (
            <HistoryCard key={item.id} item={item} />
          ))}

          {upcomingHistory.length === 0 && (
            <View style={styles.stateCard}>
              <Text style={styles.stateText}>Ingen kommende tider.</Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>Forrige tider</Text>
          {pastHistory.map((item) => (
            <HistoryCard key={item.id} item={item} />
          ))}

          {pastHistory.length === 0 && (
            <View style={styles.stateCard}>
              <Text style={styles.stateText}>Ingen tidligere tider.</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2b2b2b",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#787878",
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 4,
  },
  stateCard: {
    marginTop: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  stateText: {
    color: "#5b5560",
    fontSize: 15,
    textAlign: "center",
  },
});
