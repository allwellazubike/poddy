import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/utils/api";

interface UserProfile {
  user: { id: string; email: string; created_at?: string };
  stats: { totalPodcasts: number };
}

export default function ProfileScreen() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<UserProfile>("/auth/me")
      .then(setProfile)
      .catch((err) => Alert.alert("Error", err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const getInitial = (email?: string) =>
    email ? email.charAt(0).toUpperCase() : "?";

  return (
    <SafeAreaView style={s.screen} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>Profile</Text>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [s.closeBtn, pressed && { opacity: 0.5 }]}
          hitSlop={8}
        >
          <Ionicons name="close" size={22} color="#111111" />
        </Pressable>
      </View>

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator color="#1A1A1A" />
        </View>
      ) : profile ? (
        <View style={s.body}>
          {/* Avatar */}
          <View style={s.avatar}>
            <Text style={s.avatarText}>{getInitial(profile.user.email)}</Text>
          </View>

          <Text style={s.email}>{profile.user.email}</Text>

          {profile.user.created_at && (
            <Text style={s.joined}>
              Member since{" "}
              {new Date(profile.user.created_at).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </Text>
          )}

          {/* Stat */}
          <View style={s.statCard}>
            <View>
              <Text style={s.statLabel}>Podcasts created</Text>
              <Text style={s.statValue}>{profile.stats.totalPodcasts}</Text>
            </View>
            <Ionicons name="headset-outline" size={24} color="#888888" />
          </View>

          {/* Spacer */}
          <View style={{ flex: 1 }} />

          {/* Logout */}
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [s.logoutBtn, pressed && { opacity: 0.7 }]}
          >
            <Ionicons
              name="log-out-outline"
              size={18}
              color="#DC2626"
              style={{ marginRight: 8 }}
            />
            <Text style={s.logoutText}>Log out</Text>
          </Pressable>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F5F5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    color: "#111111",
    letterSpacing: -0.3,
  },
  closeBtn: {},
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 32,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    color: "#FFFFFF",
  },
  email: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 17,
    color: "#111111",
    marginBottom: 4,
  },
  joined: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#888888",
    marginBottom: 32,
  },

  statCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  statLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "#888888",
    marginBottom: 4,
  },
  statValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    color: "#111111",
    letterSpacing: -0.5,
  },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FCA5A5",
    backgroundColor: "#FEF2F2",
  },
  logoutText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#DC2626",
  },
});
