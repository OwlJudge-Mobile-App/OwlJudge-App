import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { auth } from "@/firebaseConfig";
import { db } from "@/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import BottomNav from "@/components/BottomNav";

export default function AccountScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Judge");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const userId = auth.currentUser?.uid;

  //   useEffect(() => {
  //     const fetchUserData = async () => {
  //       try {
  //         const docRef = doc(db, "users", userId);
  //         const docSnap = await getDoc(docRef);
  //         if (docSnap.exists()) {
  //           const data = docSnap.data();
  //           setFirstName(data.firstName || "");
  //           setLastName(data.lastName || "");
  //           setPhone(data.phone || "");
  //           setEmail(data.email || "");
  //           setRole(data.role || "Judge");
  //         }
  //       } catch (err) {
  //         console.error("Error loading profile:", err);
  //       }
  //     };

  //     fetchUserData();
  //   }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    //   try {
    //     const ref = doc(db, "users", userId);
    //     await updateDoc(ref, {
    //       firstName,
    //       lastName,
    //       phone,
    //     });
    //     Alert.alert("Success", "Profile updated");
    //   } catch (err) {
    //     console.error("Update failed", err);
    //     Alert.alert("Error", "Failed to update");
    //   }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Profile Image */}
        <TouchableOpacity onPress={pickImage} style={styles.imageBox}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Text>📷</Text>
            </View>
          )}
          <Text style={styles.plus}>➕</Text>
        </TouchableOpacity>

        {/* Fields */}
        <Field label="First Name:" value={firstName} onChange={setFirstName} />
        <Field label="Last Name:" value={lastName} onChange={setLastName} />
        <Field label="Telephone:" value={phone} onChange={setPhone} />
        <Field
          label="Email:"
          value={email}
          editable={false}
          onChange={setEmail}
        />
        <Field label="Role:" value={role} editable={false} onChange={setRole} />

        {/* Button */}
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.updateText}>Update?</Text>
        </TouchableOpacity>
      </View>

      <BottomNav />
    </View>
  );
}

function Field({
  label,
  value,
  onChange,
  editable = true,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  editable?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, !editable && { backgroundColor: "#d3d3d3" }]}
        value={value}
        onChangeText={onChange}
        editable={editable}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#696969",
    paddingVertical: 20,
    alignItems: "center",
  },
  card: {
    width: "90%",
    backgroundColor: "#D3D3D3",
    borderRadius: 15,
    padding: 20,
  },
  imageBox: {
    alignItems: "center",
    marginBottom: 10,
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#999",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  plus: {
    color: "green",
    fontSize: 20,
    marginTop: 4,
  },
  row: {
    marginVertical: 5,
  },
  label: {
    fontFamily: "IrishGrover-Regular",
    fontSize: 16,
    marginBottom: 2,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 6,
    padding: 10,
    fontFamily: "IrishGrover-Regular",
  },
  updateButton: {
    marginTop: 20,
    backgroundColor: "green",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  updateText: {
    color: "white",
    fontFamily: "IrishGrover-Regular",
    fontSize: 18,
  },
});
