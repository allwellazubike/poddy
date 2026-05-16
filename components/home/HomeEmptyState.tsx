import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants";

export function HomeEmptyState() {
  return (
    <View className="flex-1 items-center justify-center px-8 mt-16 mb-10">
      <View
        style={{
          width: 88,
          height: 88,
          borderRadius: 28,
          backgroundColor: Colors.accentSoft,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        <Ionicons name="sparkles" size={40} color={Colors.accent} />
      </View>
      <Text className="text-poddy-text-primary text-[24px] font-bold mb-3 text-center">
        Welcome to Poddy!
      </Text>
      <Text className="text-poddy-text-secondary text-[15px] text-center leading-6 mb-8">
        Your personal AI podcast generator. Turn any topic, PDF, or text into engaging audio in minutes.
      </Text>
      <TouchableOpacity
        onPress={() => router.navigate("/(tabs)/create")}
        activeOpacity={0.8}
        style={{
          backgroundColor: Colors.accent,
          borderRadius: 14,
          paddingVertical: 16,
          paddingHorizontal: 28,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: Colors.accent,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        <Ionicons name="add-circle" size={22} color="#fff" style={{ marginRight: 10 }} />
        <Text className="text-white text-[16px] font-bold">
          Create First Podcast
        </Text>
      </TouchableOpacity>
    </View>
  );
}
