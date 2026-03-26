import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import SalonCard from "@/components/SalonCard";
import SearchBar from "@/components/SearchBar";
import { loadSalonList } from "@/features/salons";
import type { SalonListItem } from "@/features/salons";

export default function SalonList() {
  const router = useRouter();
  const [salons, setSalons] = useState<SalonListItem[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    loadSalonList()
      .then(nextSalons => {
        if (!isActive) {
          return;
        }

        setSalons(nextSalons);
        setError(null);
      })
      .catch(nextError => {
        if (!isActive) {
          return;
        }

        const message = nextError instanceof Error ? nextError.message : "Kunne ikke hente saloner.";
        setError(message);
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const filteredSalons = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return salons;
    }

    return salons.filter(salon =>
      salon.name.toLowerCase().includes(query) || salon.address.toLowerCase().includes(query)
    );
  }, [salons, search]);

  const handleOpenSalon = (salonSlug: string) => {
    router.push({
      pathname: "/salon",
      params: { salonId: salonSlug },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saloner nær dig</Text>
      <SearchBar onSearch={setSearch} />

      <ScrollView>
        {isLoading && (
          <View style={styles.stateCard}>
            <ActivityIndicator size="small" color="#17171d" />
            <Text style={styles.stateText}>Henter saloner...</Text>
          </View>
        )}

        {!isLoading && error && (
          <View style={styles.stateCard}>
            <Text style={styles.stateText}>{error}</Text>
          </View>
        )}

        {!isLoading && !error && filteredSalons.length === 0 && (
          <View style={styles.stateCard}>
            <Text style={styles.stateText}>
              {salons.length === 0 ? "Ingen saloner fundet." : "Ingen saloner matcher din søgning."}
            </Text>
          </View>
        )}

        {filteredSalons.map(salon => (
          <SalonCard
            key={salon.id}
            salon={salon}
            onPress={() => handleOpenSalon(salon.slug)}
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
