import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const CATEGORIES = [
  { name: "Computer Science", icon: "code-slash" as const, color: "#7C3AED" },
  { name: "Biology", icon: "leaf" as const, color: "#059669" },
  { name: "Psychology", icon: "brain" as const, color: "#DB2777" },
  { name: "Mathematics", icon: "calculator" as const, color: "#DC2626" },
  { name: "Chemistry", icon: "flask" as const, color: "#2563EB" },
  { name: "Law", icon: "book" as const, color: "#D97706" },
  { name: "History", icon: "time" as const, color: "#8B5CF6" },
  { name: "Literature", icon: "document-text" as const, color: "#0891B2" },
  { name: "Physics", icon: "planet" as const, color: "#EA580C" },
];

export default function ExploreScreen() {
  return (
    <SafeAreaView className="flex-1 bg-poddy-bg" edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="px-5 pt-4 pb-5">
          <Text className="text-poddy-text-primary text-[24px] font-bold tracking-tight">Explore</Text>
          <Text className="text-poddy-text-secondary text-[14px] mt-1">Browse podcasts by category</Text>
        </View>

        {/* Search bar placeholder */}
        <View className="mx-5 mb-6">
          <View className="flex-row items-center bg-poddy-surface border border-poddy-border rounded-xl px-4 py-3">
            <Ionicons name="search" size={18} color="#555555" />
            <Text className="text-poddy-text-muted text-[14px] ml-3">Search podcasts...</Text>
          </View>
        </View>

        {/* Category grid */}
        <View className="px-5">
          <Text className="text-poddy-text-primary text-[16px] font-semibold mb-4">Categories</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.name}
                activeOpacity={0.7}
                style={{ width: "48%" }}
              >
                <View
                  className="bg-poddy-surface border border-poddy-border rounded-xl p-4"
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <View
                    style={{
                      width: 36, height: 36, borderRadius: 10,
                      backgroundColor: cat.color + "18",
                      alignItems: "center", justifyContent: "center", marginRight: 10,
                    }}
                  >
                    <Ionicons name={cat.icon} size={18} color={cat.color} />
                  </View>
                  <Text className="text-poddy-text-primary text-[13px] font-medium flex-1" numberOfLines={1}>
                    {cat.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
