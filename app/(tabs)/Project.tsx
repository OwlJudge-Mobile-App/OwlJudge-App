import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ProgressBarAndroid } from "react-native";
import BottomNav from "@/components/BottomNav";

export default function ProjectDetailsScreen() {
  const { name, category, participant, phone, description, link } =
    useLocalSearchParams();

  return (
    <View style={styles.container}>
      {/* Top Info */}
      <View style={styles.topInfo}>
        <View>
          <Text style={styles.eventTitle}>Event 1</Text>
          <Text style={styles.eventId}>ID: Ev_0001</Text>
        </View>
        <View>
          <Text style={styles.eventDates}>From: 03/19/2025</Text>
          <Text style={styles.eventDates}>- 03/24/2025</Text>
        </View>
      </View>
      {/* Project Info */}
      <ScrollView style={styles.infoBox}>
        <Row label="Project name:" value={name} />
        <Row label="Category:" value={category} />
        <Row label="Participant name:" value={participant} />
        <Row label="Telephone:" value={phone} />
        <Row label="Description:" value={description} />
        <Row label="Link:" value={link} />
        <Text style={styles.label}>Grade:</Text>
        <ProgressBarAndroid
          styleAttr="Horizontal"
          progress={0.4}
          color="#4169E1"
        />
        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.publishButton}>
            <Text style={styles.buttonText}>Publish</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNav />
    </View>
  );
}

function Row({ label, value }: { label: string; value?: string | string[] }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueBox}>
        <Text style={styles.valueText}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#696969" },
  topInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#D3D3D3",
    paddingBottom: 30,
  },
  eventTitle: {
    fontSize: 18,
    fontFamily: "IrishGrover-Regular",
  },
  eventId: {
    fontSize: 14,
    fontFamily: "IrishGrover-Regular",
  },
  eventDates: {
    fontSize: 14,
    fontFamily: "IrishGrover-Regular",
    textAlign: "right",
  },
  infoBox: {
    backgroundColor: "#D3D3D3",
    padding: 15,
    borderRadius: 10,
    margin: 20,
  },
  row: { marginBottom: 15 },
  label: {
    fontWeight: "bold",
    fontFamily: "IrishGrover-Regular",
    marginBottom: 5,
  },
  valueBox: {
    backgroundColor: "#E0E0E0",
    padding: 10,
    borderRadius: 5,
  },
  valueText: {
    fontFamily: "IrishGrover-Regular",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  publishButton: {
    backgroundColor: "#4169E1",
    flex: 1,
    marginRight: 10,
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "green",
    flex: 1,
    marginLeft: 10,
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontFamily: "IrishGrover-Regular",
  },
});
