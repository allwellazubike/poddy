import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
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
          // The router should automatically handle the redirect in a root layout effect,
          // but just in case, we replace to the auth flow
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const getInitial = (email?: string) => {
    return email ? email.charAt(0).toUpperCase() : "?";
  };

  return (
    <SafeAreaView className="flex-1 bg-poddy-bg" edges={["top", "bottom"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-5 border-b border-poddy-border bg-poddy-surface">
        <Text className="text-poddy-text-primary text-[24px] font-bold tracking-tight">
          Profile
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-9 h-9 items-center justify-center rounded-full bg-poddy-bg"
        >
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      ) : profile ? (
        <View className="flex-1 px-5 pt-8">
          {/* Avatar and Email */}
          <View className="items-center mb-8">
            <View
              className="w-24 h-24 rounded-full items-center justify-center mb-4 shadow-sm"
              style={{ backgroundColor: Colors.accentSoft }}
            >
              <Text className="text-poddy-accent text-[40px] font-bold">
                {getInitial(profile.user.email)}
              </Text>
            </View>
            <Text className="text-poddy-text-primary text-[20px] font-semibold">
              {profile.user.email}
            </Text>
            {profile.user.created_at && (
              <Text className="text-poddy-text-secondary text-[14px] mt-1">
                Joined {new Date(profile.user.created_at).toLocaleDateString()}
              </Text>
            )}
          </View>

          {/* Stats Card */}
          <View className="bg-poddy-surface border border-poddy-border rounded-2xl p-5 mb-8 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View
                className="w-12 h-12 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: Colors.accentSoft }}
              >
                <Ionicons name="mic" size={24} color={Colors.accent} />
              </View>
              <View>
                <Text className="text-poddy-text-secondary text-[14px] font-medium">
                  Podcasts Created
                </Text>
                <Text className="text-poddy-text-primary text-[24px] font-bold mt-1">
                  {profile.stats.totalPodcasts}
                </Text>
              </View>
            </View>
          </View>

          {/* Settings / Account Options */}
          <View className="bg-poddy-surface border border-poddy-border rounded-2xl overflow-hidden mb-8">
            <TouchableOpacity className="flex-row items-center justify-between px-5 py-4 border-b border-poddy-border">
              <View className="flex-row items-center">
                <Ionicons name="settings-outline" size={20} color={Colors.textSecondary} />
                <Text className="text-poddy-text-primary text-[16px] ml-3">Settings</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center justify-between px-5 py-4">
              <View className="flex-row items-center">
                <Ionicons name="help-buoy-outline" size={20} color={Colors.textSecondary} />
                <Text className="text-poddy-text-primary text-[16px] ml-3">Help & Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.8}
            className="w-full bg-red-50 py-4 rounded-xl items-center flex-row justify-center border border-red-100"
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" className="mr-2" />
            <Text className="text-red-500 text-[16px] font-bold ml-2">Log Out</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
