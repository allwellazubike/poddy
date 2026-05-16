import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/utils/api";
import { Colors } from "@/constants";

interface UserProfile {
  user: {
    id: string;
    email: string;
    created_at?: string;
  };
  stats: {
    totalPodcasts: number;
  };
}

export default function ProfileScreen() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiFetch<UserProfile>("/auth/me");
        setProfile(data);
      } catch (err: any) {
        Alert.alert("Error", err.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const getInitial = (email?: string) => {
    return email ? email.charAt(0).toUpperCase() : "?";
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 24, paddingVertical: 24, borderBottomWidth: 1, borderBottomColor: Colors.border }}>
        <Text style={{ fontFamily: "Inter_800ExtraBold", fontSize: 24, color: Colors.textPrimary, letterSpacing: -0.5 }}>
          Profile
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        >
          <Ionicons name="close" size={28} color={Colors.textPrimary} />
        </Pressable>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={Colors.textPrimary} />
        </View>
      ) : profile ? (
        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 40 }}>
          {/* Avatar and Email */}
          <View style={{ alignItems: "center", marginBottom: 48 }}>
            <View
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                backgroundColor: Colors.surface,
                borderWidth: 1,
                borderColor: Colors.border,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Text style={{ fontFamily: "Inter_700Bold", fontSize: 40, color: Colors.textPrimary }}>
                {getInitial(profile.user.email)}
              </Text>
            </View>
            <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 20, color: Colors.textPrimary, marginBottom: 4 }}>
              {profile.user.email}
            </Text>
            {profile.user.created_at && (
              <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: Colors.textSecondary }}>
                Joined {new Date(profile.user.created_at).toLocaleDateString()}
              </Text>
            )}
          </View>

          {/* Stats */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 24, borderTopWidth: 1, borderBottomWidth: 1, borderTopColor: Colors.border, borderBottomColor: Colors.border, marginBottom: 40 }}>
            <View>
              <Text style={{ fontFamily: "Inter_500Medium", fontSize: 12, color: Colors.textSecondary, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                Podcasts Created
              </Text>
              <Text style={{ fontFamily: "Inter_700Bold", fontSize: 32, color: Colors.textPrimary }}>
                {profile.stats.totalPodcasts}
              </Text>
            </View>
            <Ionicons name="mic-outline" size={32} color={Colors.textSecondary} />
          </View>

          {/* Logout Button */}
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => ({
              width: "100%",
              height: 56,
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: "#EF4444",
              borderRadius: 4,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              opacity: pressed ? 0.5 : 1,
            })}
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
            <Text style={{ fontFamily: "Inter_600SemiBold", color: "#EF4444", fontSize: 16 }}>
              Log Out
            </Text>
          </Pressable>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
