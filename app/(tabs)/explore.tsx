import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CATEGORIES } from "@/constants";
import { ScreenHeader } from "@/components/ui";
import { CategoryCard, SearchBar } from "@/components/explore";

export default function ExploreScreen() {
  return (
    <SafeAreaView className="flex-1 bg-poddy-bg" edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <ScreenHeader title="Explore" subtitle="Browse podcasts by category" />

        {/* Search */}
        <View className="mx-5 mb-6">
          <SearchBar />
        </View>

        {/* Category grid */}
        <View className="px-5">
          <Text className="text-poddy-text-primary text-[16px] font-semibold mb-4">
            Categories
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {CATEGORIES.map((cat) => (
              <CategoryCard key={cat.name} category={cat} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
