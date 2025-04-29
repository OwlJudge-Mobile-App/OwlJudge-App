// app/(tabs)/event-details.tsx
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ProgressBarAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "@/services/api";

const projects = [
  { id: "1", name: "Project 1", grade: 0.5, published: true },
  { id: "2", name: "Project 2", grade: 0.7, published: false },
  { id: "3", name: "Project 3", grade: 0.6, published: false },
  { id: "4", name: "Project 4", grade: 0.4, published: false },
  { id: "5", name: "Project 5", grade: 0.1, published: false },
  { id: "6", name: "Project 6", grade: 0.1, published: false },
  { id: "7", name: "Project 7", grade: 0.1, published: false },
  { id: "8", name: "Project 8", grade: 0.1, published: false },
  { id: "9", name: "Project 9", grade: 0.1, published: false },
];

export default function EventDetailsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { id: eventId } = useLocalSearchParams(); // get eventId from URL
  console.log(eventId);

  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get("/event-details", {
          params: { eventId },
        });

        setEventData(response.data);
        setProjects(response.data.projects);
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, []);

  const filteredProjects = projects.filter((proj) =>
    proj.project_name.toLowerCase().includes(search.toLowerCase())
  );

  const renderProject = ({ item }: { item: (typeof projects)[0] }) => (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/(tabs)/Project",
          params: {
            id: eventId,
            project_id: item.id,
          },
        });
      }}
    >
      <View style={styles.projectRow}>
        <Text style={[styles.cell, { flex: 2 }]}>{item.project_name}</Text>
        <ProgressBarAndroid
          styleAttr="Horizontal"
          indeterminate={false}
          progress={item.grade}
          style={styles.progressBar}
          color="#4169E1"
        />
        <View style={(styles.cell, [{ flex: 1, alignItems: "center" }])}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor:
                  item.published === "Published" ? "green" : "red",
              },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  function formatDate(dateString: string) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  return (
    <View style={styles.container}>
      {/* Top Info */}
      <View style={styles.topInfo}>
        <View>
          <Text style={styles.eventTitle}>{eventData?.event_name}</Text>
          <Text style={styles.eventId}>ID: {eventData?.event_id}</Text>
        </View>
        <View>
          <Text style={styles.eventDates}>
            From: {formatDate(eventData?.start_date)}
          </Text>
          <Text style={styles.eventDates}>
            - {formatDate(eventData?.end_date)}
          </Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.topButtons}>
        <TouchableOpacity style={styles.criteriaButton}>
          <Text style={styles.buttonText}>Judging Criteria</Text>
        </TouchableOpacity>
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
          <Ionicons name="search" size={20} color="gray" />
        </View>
      </View>
      {/* List Header */}
      <View style={[styles.projectRow, styles.listHeader]}>
        <Text style={[styles.headerCell, { flex: 2 }]}>Project Name</Text>
        <Text style={[styles.headerCell, { flex: 3 }]}>Grade</Text>
        <Text style={[styles.headerCell, { flex: 1 }]}>Published</Text>
      </View>
      {/* Project List */}
      <FlatList
        data={filteredProjects}
        renderItem={renderProject}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
      {/* Bottom Navigation */}
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#696969" },
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
  topButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginVertical: 20,
  },
  criteriaButton: {
    backgroundColor: "#A9A9A9",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  buttonText: {
    fontFamily: "IrishGrover-Regular",
    fontSize: 16,
  },
  searchBox: {
    flexDirection: "row",
    backgroundColor: "#A9A9A9",
    borderRadius: 20,
    paddingHorizontal: 10,
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "IrishGrover-Regular",
  },
  listHeader: {
    backgroundColor: "#505050",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomColor: "white",
    borderBottomWidth: 2,
  },
  headerCell: {
    color: "white",
    fontFamily: "IrishGrover-Regular",
    fontSize: 14,
  },
  projectRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomColor: "white",
    borderBottomWidth: 1,
  },
  cell: {
    fontFamily: "IrishGrover-Regular",
    fontSize: 14,
    color: "white",
  },
  progressContainer: {},
  progressBar: {
    flex: 3,
    height: 10,
    marginRight: 10,
  },
  statusDot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
  },
  listContent: {
    flex: 1,
  },
});
