import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export function HomeEmptyState() {
  return (
    <View style={s.container}>
      <View style={s.icon}>
        <Ionicons name="mic-outline" size={28} color="#888888" />
      </View>

      <Text style={s.title}>Start creating</Text>
      <Text style={s.body}>
        Upload a PDF and Poddy will turn it into a podcast for you.
      </Text>

      <Pressable
        style={({ pressed }) => [s.btn, pressed && s.pressed]}
        onPress={() => router.navigate("/(tabs)/create")}
      >
        <Text style={s.btnText}>New podcast</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    color: "#111111",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  body: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: "#888888",
    lineHeight: 22,
    marginBottom: 28,
    maxWidth: 280,
  },
  btn: {
    height: 48,
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.8 },
  btnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#FFFFFF",
  },
});
