import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ProgressBarAndroid } from "react-native";
import BottomNav from "@/components/BottomNav";
import { useEffect, useState } from "react";
import api from "@/services/api";
import Slider from "@react-native-community/slider";

export default function ProjectDetailsScreen() {
  const { id: eventId, project_id: projectId } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState<any>(null);
  const [projectData, setProjectData] = useState<any>(null);

  const [grade, setGrade] = useState<number>(0); // initial grade

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await api.get("/project-details", {
          params: { eventId, projectId },
        });
        setEventData({
          event_name: response.data.event_name,
          event_id: response.data.event_id,
          start_date: response.data.start_date,
          end_date: response.data.end_date,
        });
        setProjectData(response.data.project);
        setGrade(response.data.project.grade ?? 0);
      } catch (error) {
        console.error("Error fetching project details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1, justifyContent: "center" }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContent}>
        {/* Top Info */}
        <View style={styles.topInfo}>
          <View>
            <Text style={styles.eventTitle}>{eventData.event_name}</Text>
            <Text style={styles.eventId}>ID: {eventData.event_id}</Text>
          </View>
          <View>
            <Text style={styles.eventDates}>
              From: {formatDate(eventData.start_date)}
            </Text>
            <Text style={styles.eventDates}>
              - {formatDate(eventData.end_date)}
            </Text>
          </View>
        </View>
        {/* Project Info */}
        <View style={styles.infoBox}>
          <Row label="Project name:" value={projectData.project_name} />
          <Row label="Category:" value={projectData.category} />
          <Row label="Participant name:" value={projectData.participant_name} />
          <Row label="Telephone:" value={projectData.phone} />
          <Row label="Description:" value={projectData.description} />
          <Row label="Link:" value={projectData.link} />
          <View style={styles.sliderBox}>
            <Text style={styles.sliderLabel}>Grade: {grade}%</Text>
            <Slider
              style={{ width: "100%", height: 40 }}
              minimumValue={0}
              maximumValue={1}
              step={5}
              value={grade}
              minimumTrackTintColor="#4169E1"
              maximumTrackTintColor="#000000"
              onValueChange={(value) => setGrade(value)}
            />
          </View>
          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.publishButton}>
              <Text style={styles.buttonText}>Publish</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
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

function formatDate(dateString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}
const styles = StyleSheet.create({
  container: { backgroundColor: "#696969", flex: 1 },
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
    marginBottom: 0,
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
  sliderBox: {
    marginVertical: 20,
  },
  sliderLabel: {
    fontFamily: "IrishGrover-Regular",
    color: "black",
    fontSize: 16,
    marginBottom: 10,
  },
  scrollContent: {
    paddingBottom: 100, // <-- this must be at least the same or bigger than BottomNav height
  },
});
