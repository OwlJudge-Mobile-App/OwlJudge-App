import { Fonts } from "@/constants/Fonts";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";

// Starting data. Will be further replaced by an api call.
const events = [
  { id: "1", title: "Event 1", status: "Ongoing", participants: 20 },
  { id: "2", title: "Event 2", status: "Complete", participants: 20 },
  { id: "3", title: "Event 3", status: "Not Started", participants: 20 },
  { id: "4", title: "Event 4", status: "Canceled", participants: 20 },
];

export default function HomeScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  // change color based on event status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "ongoing":
        return "brown";
      case "complete":
        return "green";
      case "not started":
        return "gray";
      case "canceled":
        return "red";
      default:
        return "black";
    }
  };

  const renderEventCard = ({ item }: { item: (typeof events)[0] }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => router.navigate("/Event")}
    >
      <View style={styles.card}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <View style={styles.separator} />
        <Text style={styles.status}>
          Status:{" "}
          <Text style={{ color: getStatusColor(item.status) }}>
            {item.status}
          </Text>
        </Text>
      </View>
      <View style={styles.participantBox}>
        <Text style={styles.participantText}>
          {item.participants} Participant
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <Text style={styles.welcomeText}>Welcome back, Roan</Text>
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
          <Image
            source={require("../../assets/images/search-icon-png-21.png")}
            style={styles.icon}
          />
        </View>
      </View>

      {/* Middle Section (Events) */}
      <View style={styles.eventsSection}>
        <FlatList
          data={events}
          renderItem={renderEventCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.eventsList}
        />
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Image
            style={styles.navIcon}
            source={require("../../assets/images/home-icon.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            style={styles.navIcon}
            source={require("../../assets/images/edit-icon.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            style={styles.navIcon}
            source={require("../../assets/images/help-252.png")}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#D3D3D3" },
  cardContainer: {
    flex: 1,
    flexDirection: "column",
    marginHorizontal: 10,
    marginTop: 10,
  },
  topSection: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    backgroundColor: "#D3D3D3",
    justifyContent: "center",
  },
  welcomeText: {
    fontSize: 20,
    fontFamily: "IrishGrover-Regular", // or whatever font you loaded
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: "row",
    backgroundColor: "#A9A9A9",
    borderRadius: 20,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 5,
    fontFamily: Fonts.IrishGroverRegular,
  },
  eventsSection: {
    flex: 1,
    backgroundColor: "#696969",
    paddingTop: 10,
  },
  eventsList: {
    paddingHorizontal: 10,
    gap: 10,
  },
  card: {
    backgroundColor: "#DCDCDC",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    flex: 1,
    paddingVertical: 20,
    minHeight: 150,
  },
  eventTitle: {
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "IrishGrover-Regular",
    paddingLeft: 8,
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "black",
    marginVertical: 5,
    marginBottom: 15,
  },
  status: {
    fontSize: 14,
    fontFamily: "IrishGrover-Regular",
    paddingLeft: 8,
  },
  participantBox: {
    backgroundColor: "#5C5C5C",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingVertical: 15,
  },
  participantText: {
    color: "white",
    fontSize: 14,
    fontFamily: "IrishGrover-Regular",
    textAlign: "center",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 70,
    backgroundColor: "#D3D3D3",
  },
  icon: {
    width: 20,
    height: 20,
  },
  navIcon: {
    width: 30,
    height: 30,
  },
});
