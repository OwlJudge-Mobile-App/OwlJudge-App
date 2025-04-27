import { Fonts } from "@/constants/Fonts";
import { Image, StyleSheet, TextInput, View } from "react-native";

interface LoginInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  iconSource: any;
  secureTextEntry?: boolean;
}

export default function LoginInput({
  value,
  onChangeText,
  placeholder,
  iconSource,
  secureTextEntry = false,
}: LoginInputProps) {
  return (
    <View style={styles.inputContainer}>
      <Image source={iconSource} style={styles.icon} resizeMode="contain" />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#828282"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C7C6C5",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#C7C6C5",
    height: 50,
  },
  icon: { width: 24, height: 24, marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 16,
    borderColor: "#C7C6C5",
    backgroundColor: "#C7C6C5",
    fontFamily: Fonts.IrishGroverRegular,
  },
});
