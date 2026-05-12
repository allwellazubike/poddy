import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "./global.css";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#F6F6F9" },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="player/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
