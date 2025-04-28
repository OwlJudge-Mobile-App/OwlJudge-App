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
import { useState } from "react";

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
  const [search, setSearch] = useState("");

  const filteredProjects = projects.filter((proj) =>
    proj.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderProject = ({ item }: { item: (typeof projects)[0] }) => (
    <View style={styles.projectRow}>
      <Text style={styles.projectName}>{item.name}</Text>
      <ProgressBarAndroid
        styleAttr="Horizontal"
        indeterminate={false}
        progress={item.grade}
        style={styles.progressBar}
        color="#4169E1"
      />
      <View
        style={[
          styles.statusDot,
          { backgroundColor: item.published ? "green" : "red" },
        ]}
      />
    </View>
  );

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
      <View style={styles.listHeader}>
        <Text style={styles.headerText}>Project name</Text>
        <Text style={styles.headerText}>Grade</Text>
        <Text style={styles.headerText}>Published</Text>
      </View>

      {/* Project List */}
      <FlatList
        data={filteredProjects}
        renderItem={renderProject}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
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
    marginVertical: 10,
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
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    marginBottom: 5,
  },
  headerText: {
    fontFamily: "IrishGrover-Regular",
    color: "white",
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 10,
  },
  projectRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomColor: "white",
    borderBottomWidth: 1,
  },
  projectName: {
    flex: 2,
    fontFamily: "IrishGrover-Regular",
    color: "white",
  },
  progressBar: {
    flex: 3,
    height: 10,
    marginHorizontal: 10,
  },
  statusDot: {
    width: 15,
    height: 15,
    borderRadius: 10,
  },
});
