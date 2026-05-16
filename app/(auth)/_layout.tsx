import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#F6F6F9" },
        animation: "slide_from_bottom",
      }}
    />
  );
}
