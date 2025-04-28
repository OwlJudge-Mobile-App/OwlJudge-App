// app/layout.tsx
import { Redirect, Stack } from "expo-router";
import {
  useFonts,
  IrishGrover_400Regular,
} from "@expo-google-fonts/irish-grover";
import { SplashScreen } from "expo-router"; // Use SplashScreen while fonts load
import { useEffect } from "react";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    IrishGrover_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync(); // hide splash after fonts load
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Show nothing (or you can create a custom loading spinner later)
  }

  return <Redirect href={"/Login"} />;
}
