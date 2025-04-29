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
      <TouchableOpacity>
        <Image
          style={styles.navIcon}
          source={require("../assets/images/edit-icon.png")}
        />
      </TouchableOpacity>
      <TouchableOpacity>
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
  },
  navIcon: {
    width: 30,
    height: 30,
  },
});
