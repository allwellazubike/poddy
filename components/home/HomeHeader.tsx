import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export function HomeHeader() {
  const { user } = useAuth();

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const getInitial = () => {
    if (!user?.email) return "?";
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <View style={s.container}>
      <View>
        <Text style={s.greeting}>{getGreeting()}</Text>
        <Text style={s.appName}>Poddy</Text>
      </View>

      <Pressable
        style={({ pressed }) => [s.avatar, pressed && { opacity: 0.6 }]}
        onPress={() => router.push("/profile")}
      >
        <Text style={s.avatarText}>{getInitial()}</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: "#F5F5F5",
  },
  greeting: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "#888888",
    marginBottom: 2,
  },
  appName: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    color: "#111111",
    letterSpacing: -0.5,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#FFFFFF",
  },
});
