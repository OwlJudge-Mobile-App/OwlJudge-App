import { Fonts } from "@/constants/Fonts";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface RegisterInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

export default function RegisterInput({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
}: RegisterInputProps) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 70,
  },
  label: {
    fontFamily: Fonts.IrishGroverRegular,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderColor: "#C7C6C5",
    backgroundColor: "#C7C6C5",
    fontFamily: Fonts.IrishGroverRegular,
  },
});
