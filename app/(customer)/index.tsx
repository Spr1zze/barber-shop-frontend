import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import SalonCard from "@/components/SalonCard";
import SearchBar from "@/components/SearchBar";

const TEST_SALON_ID = "downtown-hair";
const SALON_CARD_IDS = [
  TEST_SALON_ID,
  TEST_SALON_ID,
  TEST_SALON_ID,
  TEST_SALON_ID,
  TEST_SALON_ID,
  TEST_SALON_ID,
];

export default function SalonList() {
  const router = useRouter();

  const handleOpenSalon = (salonId: string = TEST_SALON_ID) => {
    router.push({
      pathname: "/salon",
      params: { salonId },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saloner nær dig</Text>
      <SearchBar onSearch={(text) => console.log(text)} />

      <ScrollView>
        {SALON_CARD_IDS.map((salonId, index) => (
          <SalonCard
            key={`${salonId}-${index}`}
            id={index}
            onPress={() => handleOpenSalon(salonId)}
          />
        ))}
      </ScrollView>
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
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
