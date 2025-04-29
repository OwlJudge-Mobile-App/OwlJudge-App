import { useRouter } from "expo-router";
import { TouchableOpacity, View, Image, StyleSheet } from "react-native";

export default function BottomNav() {
  const router = useRouter();
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity onPress={() => router.replace("/(tabs)/Home")}>
        <Image
          style={styles.navIcon}
          source={require("../assets/images/home-icon.png")}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace("/(tabs)/Account")}>
        <Image
          style={styles.navIcon}
          source={require("../assets/images/icons8-account-100.png")}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace("/(tabs)/Help")}>
        <Image
          style={styles.navIcon}
          source={require("../assets/images/help-252.png")}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 70,
    backgroundColor: "#D3D3D3",
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navIcon: {
    width: 30,
    height: 30,
  },
});
