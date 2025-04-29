import BottomNav from "@/components/BottomNav";
import { Fonts } from "@/constants/Fonts";
import { auth } from "@/firebaseConfig";
import api from "@/services/api";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await api.get("/home", {
          params: { userId: userId },
        });
        setFirstName(response.data.message);
        console.log(firstName);

        setEvents(response.data.events);
      } catch (error: any) {
        console.error("Failed to fetch home data", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size={"large"}
        style={{ flex: 1, justifyContent: "center" }}
      />
    );
  }

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
      onPress={() => router.push(`/Event?id=${item.id}`)}
    >
      <View style={styles.card}>
        <Text style={styles.eventTitle}>{item.event_name}</Text>
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

  const filteredEvents = events.filter((item) =>
    item.event_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <Text style={styles.welcomeText}>Welcome back, {firstName}</Text>
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
          data={filteredEvents}
          renderItem={renderEventCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.eventsList}
        />
      </View>

      {/* Bottom Navigation */}
      <BottomNav />
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
