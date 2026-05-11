import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader, FilterPill, EmptyState } from "@/components/ui";

const FILTER_OPTIONS = ["All", "Done", "Processing"] as const;

export default function LibraryScreen() {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  return (
    <SafeAreaView className="flex-1 bg-poddy-bg" edges={["top"]}>
      <ScreenHeader title="Library" subtitle="Your generated podcasts" />

      {/* Filter pills */}
      <View className="flex-row px-5 mb-4">
        {FILTER_OPTIONS.map((label) => (
          <FilterPill
            key={label}
            label={label}
            active={activeFilter === label}
            onPress={() => setActiveFilter(label)}
          />
        ))}
      </View>

      {/* Empty state (will be replaced with FlatList when data exists) */}
      <EmptyState
        icon="library-outline"
        title="No podcasts yet"
        message="Your generated podcasts will appear here."
      />
    </SafeAreaView>
  );
}
