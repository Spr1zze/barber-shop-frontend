import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { useAuth } from "../app/contexts/AuthContext";
import Logo from "../assets/images/icon.png";

export default function TopBar() {
  const [menuVisible, setMenuVisible] = useState(false);
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    setMenuVisible(false);
    logout();
    router.replace("/login");
  };

  return (
    <View style={styles.topbar}>
      <Image source={Logo} style={styles.logo} />

      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userRole}>({user?.role})</Text>
      </View>

      <Pressable onPress={() => setMenuVisible(!menuVisible)} style={styles.menuButton}>
        <Ionicons name="menu-outline" size={28} color="#5a5561" />
      </Pressable>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.dropdown}>
            <Pressable onPress={handleLogout} style={styles.menuItem}>
              <Ionicons name="log-out-outline" size={20} color="#5a5561" />
              <Text style={styles.menuText}>Log ud</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  topbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  logo: {
    width: 175,
    height: 40,
  },
  userInfo: {
    flex: 1,
    marginLeft: 15,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
  },
  userRole: {
    fontSize: 12,
    color: "#666",
  },
  menuButton: {
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  dropdown: {
    marginTop: 60,
    marginRight: 10,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 150,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuText: {
    fontSize: 16,
    color: "#5a5561",
    marginLeft: 10,
  },
});
