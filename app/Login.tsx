// screens/LoginScreen.js
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
        <View style={styles.header}>
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Owl Judge</Text>
        </View>
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
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
  header: {
    alignItems: "flex-end",
    flexDirection: "row",
  },
  logo: {
    width: 80,
    height: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    fontFamily: Fonts.IrishGroverRegular,
  },
  input: {
    height: 50,
    borderColor: "#C7C6C5",
    backgroundColor: "#C7C6C5",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4CA164",
    paddingVertical: 15,
    borderRadius: 20,
    marginBottom: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  linkText: {
    textAlign: "center",
    marginTop: 10,
    color: "#828282",
  },
});
