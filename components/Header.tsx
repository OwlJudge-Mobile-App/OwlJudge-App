import { View, Text, StyleSheet, Image } from "react-native";
import { Fonts } from "@/constants/Fonts";

interface HeaderProps {
  title: String;
  showLogo?: boolean;
}

export default function Header({ title, showLogo = true }: HeaderProps) {
  return (
    <View style={styles.header}>
      {showLogo && (
        <Image
          source={require("../assets/images/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      )}
      <Text style={styles.title}>Owl Judge</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 30,
  },
  logo: {
    width: 70,
    height: 70,
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: Fonts.IrishGroverRegular,
  },
});
