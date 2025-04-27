import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { Fonts } from "@/constants/Fonts";
import Header from "@/components/Header";
import LoginInput from "@/components/LoginInput";

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Login with", email, password);
    // Later: connect to backend API
  };

  return (
    <ImageBackground
      source={require("../assets/images/background-img.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Header title={"Owl Judge"} />
        <LoginInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email address"
          iconSource={require("../assets/images/email-icon.webp")}
        />
        <LoginInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          iconSource={require("../assets/images/password-148.png")}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.navigate("/Register")}>
          <Text style={styles.linkText}>No account? Create one.</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 30,
    paddingHorizontal: 30,
    maxHeight: 400,
    borderRadius: 10,
    backgroundColor: "#D8D8D7",
  },
  button: {
    backgroundColor: "#4CA164",
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 30,
    marginTop: 10,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    fontFamily: Fonts.IrishGroverRegular,
  },
  linkText: {
    fontFamily: Fonts.IrishGroverRegular,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 10,
    color: "#828282",
  },
});
