import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "./global.css";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#080808" },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
