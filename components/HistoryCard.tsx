import { MaterialIcons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";
import type { History } from "../features/history/data/historyData";

type Props = {
  item: History;
};

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);

  return date.toLocaleDateString("da-DK", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24-hour format
  });
}

export default function HistoryCard({ item }: Props) {
  return (
    <View style={styles.card}>
      {/* Image on the left */}
      <Image
        source={require("../assets/images/DowntownHair.jpeg")}
        style={styles.image}
      />

      {/* Details in the middle (column) */}
      <View style={styles.detailsContainer}>
        <Text style={styles.service}>{item.service}</Text>
        <Text style={styles.barber}>{item.barbername}</Text>
        <View style={styles.locationRow}>
          <MaterialIcons
            name="location-on"
            size={16}
            color="#666"
            style={styles.icon}
          />
          <Text style={styles.salon}>{item.salonaddress}</Text>
        </View>
        <Text style={styles.datetime}>{formatDateTime(item.datetime)}</Text>
        <Text style={styles.price}>{item.price} kr</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    marginHorizontal: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },

  detailsContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },

  service: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },

  barber: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  salon: {
    fontSize: 13,
    color: "#999",
  },

  datetime: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },

  price: {
    fontSize: 14,
    fontWeight: "600",
    color: "#17a2a2",
  },

  icon: {
    marginRight: 6,
    marginTop: 1,
  },
});
