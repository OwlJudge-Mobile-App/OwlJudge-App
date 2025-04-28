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
  Alert,
} from "react-native";
import { Fonts } from "@/constants/Fonts";
import Header from "@/components/Header";
import LoginInput from "@/components/LoginInput";
import api from "@/services/api";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // Handling connection to backend API
    console.log("Login with", email, password);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        Alert.alert("Success", "Logged in successfully.");
        // Redirect to Home
        router.replace("../(tabs)/Home");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Alert.alert("Unsuccessful", `Invalid credentials.`);
        console.log(
          `Something went wrong. Error ${errorCode}: ${errorMessage}`
        );
      });
  };

  return (
    <ImageBackground
      source={require("../../assets/images/background-img.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Header title={"Owl Judge"} />
        <LoginInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email address"
          iconSource={require("../../assets/images/email-icon.webp")}
        />
        <LoginInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          iconSource={require("../../assets/images/password-148.png")}
          secureTextEntry={true}
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
