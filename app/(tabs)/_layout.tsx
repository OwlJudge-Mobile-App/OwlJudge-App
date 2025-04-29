import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        gestureEnabled: true, // Enable swipe back globally
        gestureDirection: "horizontal",
      }}
    >
      <Stack.Screen name="Home" />
      <Stack.Screen name="Event" />
      <Stack.Screen name="Project" />
    </Stack>
  );
}
