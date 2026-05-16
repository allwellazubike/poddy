import React from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants";

export function HomeEmptyState() {
  return (
    <View style={{ flex: 1, paddingHorizontal: 24, justifyContent: "center", alignItems: "flex-start", paddingVertical: 48 }}>
      <Text
        style={{
          fontFamily: "Inter_800ExtraBold",
          fontSize: 32,
          color: Colors.textPrimary,
          letterSpacing: -1,
          marginBottom: 16,
        }}
      >
        Start Creating.
      </Text>
      <Text
        style={{
          fontFamily: "Inter_400Regular",
          fontSize: 16,
          color: Colors.textSecondary,
          lineHeight: 24,
          marginBottom: 40,
        }}
      >
        Transform any text or PDF into a professional podcast. No complicated settings, just upload and listen.
      </Text>
      <Pressable
        onPress={() => router.navigate("/(tabs)/create")}
        style={({ pressed }) => ({
          backgroundColor: Colors.textPrimary,
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 4,
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        })}
      >
        <Text
          style={{
            fontFamily: "Inter_600SemiBold",
            fontSize: 14,
            color: Colors.bg,
            letterSpacing: 0.5,
          }}
        >
          New Project
        </Text>
      </Pressable>
    </View>
  );
}
