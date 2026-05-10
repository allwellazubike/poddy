import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function LibraryScreen() {
  return (
    <SafeAreaView className="flex-1 bg-poddy-bg" edges={["top"]}>
      {/* Header */}
      <View className="px-5 pt-4 pb-5">
        <Text className="text-poddy-text-primary text-[24px] font-bold tracking-tight">Library</Text>
        <Text className="text-poddy-text-secondary text-[14px] mt-1">Your generated podcasts</Text>
      </View>

      {/* Filter pills placeholder */}
      <View className="flex-row px-5 mb-4">
        {["All", "Done", "Processing"].map((label, idx) => (
          <View
            key={label}
            className="mr-2 rounded-lg border border-poddy-border px-4 py-1.5"
            style={idx === 0 ? { backgroundColor: "#7C3AED", borderColor: "#7C3AED" } : {}}
          >
            <Text
              className="text-[13px] font-medium"
              style={{ color: idx === 0 ? "#fff" : "#888" }}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>

      {/* Empty state */}
      <View className="flex-1 items-center justify-center px-8">
        <View className="w-16 h-16 rounded-2xl bg-poddy-surface border border-poddy-border items-center justify-center mb-5">
          <Ionicons name="library-outline" size={28} color="#555555" />
        </View>
        <Text className="text-poddy-text-primary text-[17px] font-semibold mb-2">No podcasts yet</Text>
        <Text className="text-poddy-text-secondary text-[14px] text-center leading-5">
          Your generated podcasts will appear here.
        </Text>
      </View>
    </SafeAreaView>
  );
}
