import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "@/components/BottomNav"; // adjust path to match your setup
import { auth } from "@/firebaseConfig"; // Firebase auth to handle logout

export default function HelpScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace("/(auth)/Login"); // Redirect to login
    } catch (error) {
      Alert.alert("Error", "Failed to log out.");
    }
  };

  const Item = ({
    label,
    onPress,
    color = "white",
  }: {
    label: string;
    onPress: () => void;
    color?: string;
  }) => (
    <TouchableOpacity onPress={onPress} style={styles.item}>
      <Text style={[styles.label, { color }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color={color} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Need help?</Text>

      <ScrollView>
        <Item label="About this version" onPress={() => {}} />
        <Item label="Language" onPress={() => {}} />
        <Item label="How to use" onPress={() => {}} />
        <Item label="Log out" onPress={handleLogout} color="red" />
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#696969",
  },
  title: {
    fontSize: 32,
    textAlign: "center",
    fontFamily: "IrishGrover-Regular",
    paddingVertical: 20,
    color: "black",
    backgroundColor: "#D3D3D3",
  },
  item: {
    backgroundColor: "#505050",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomColor: "white",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    fontFamily: "IrishGrover-Regular",
  },
});
