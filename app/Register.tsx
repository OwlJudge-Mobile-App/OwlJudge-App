// screens/RegisterScreen.js
import React, { useState } from "react";
import { router, useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Alert,
} from "react-native";
import Header from "@/components/Header";
import RegisterInput from "@/components/RegisterInput";
import { Fonts } from "@/constants/Fonts";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import axios from "axios";
import api from "@/services/api";

const RegisterScreen = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    console.log("Register with", {
      firstName,
      lastName,
      email,
      address,
      phone,
      password,
    });

    // Input validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Error", "All fields must be filled.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords are not matching.");
      return;
    }
    // Registering user to Firebase Auth.
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log("User registered: ", user.uid);

        // Save extra profile data in Firestore
        try {
          const response = await api.post("/signup", {
            id: user.uid,
            firstName,
            lastName,
            email,
            phone,
          });

          if (response.status === 201) {
            console.log(response.data);
            Alert.alert("Success", "Registered successfully.");
          } else {
            Alert.alert(
              "Error",
              `Something went wrong. Error ${response.status}: ${response.data.message}`
            );
          }
        } catch (error: any) {
          console.error("Registration error", error);
          // Better error handling
          if (error.response) {
            // The server responded with a status code outside of 2xx range
            Alert.alert(
              "Error",
              `Server error: ${error.response.status} - ${
                error.response.data?.message || "Unknown error"
              }`
            );
          } else if (error.request) {
            // The request was made but no response was received
            Alert.alert(
              "Error",
              "No response from server. Please try again later."
            );
          } else {
            // Something happened in setting up the request
            Alert.alert("Error", `Request failed: ${error.message}`);
          }
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Alert.alert(
          "Error",
          `Something went wrong. Error ${errorCode}: ${errorMessage}`
        );
      });
  };

  return (
    <ImageBackground
      source={require("../assets/images/background-img.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Header title={"Owl Judge"} />

        <RegisterInput
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <RegisterInput
          label="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        <RegisterInput
          label="Email Address"
          value={email}
          onChangeText={setEmail}
        />
        <RegisterInput label="Phone" value={phone} onChangeText={setPhone} />
        <RegisterInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <RegisterInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.navigate("/Login")}>
          <Text style={styles.linkText}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    marginHorizontal: 30,
    paddingHorizontal: 30,
    marginVertical: 20,
    borderRadius: 10,
    backgroundColor: "#D8D8D7",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#aaa",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#28A745",
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: Fonts.IrishGroverRegular,
  },
  linkText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
    color: "#828282",
    marginBottom: 10,
    fontFamily: Fonts.IrishGroverRegular,
  },
});
