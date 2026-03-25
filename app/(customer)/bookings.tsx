import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import HistoryCard from "../../components/HistoryCard";
import { loadHistory } from "../../features/history/api/loadHistory";
import type { History } from "../../features/history/data/historyData";

export default function HistoryPage() {
  const [history, setHistory] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);

  const todaysDate = new Date(Date.now());
  const upcomingHistory = history.filter((element) => {
    const elDate = new Date(element.datetime);
    return elDate >= todaysDate;
  });
  const pastHistory = history.filter((element) => {
    const elDate = new Date(element.datetime);
    return elDate <= todaysDate;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadHistory();
        setHistory(data);
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
        <Text>Loading...</Text>
      ) : (
        <ScrollView>
          <Text style={styles.text}>Kommende tider</Text>
          {upcomingHistory.map((item) => (
            <HistoryCard key={item.id} item={item} />
          ))}
          <Text style={styles.text}>Forige tider</Text>
          {pastHistory.map((item) => (
            <HistoryCard key={item.id} item={item} />
          ))}
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
  text: {
    fontSize: 14,
    color: "#787878",
    flexDirection: "row",
    alignItems: "center",
  },
});
