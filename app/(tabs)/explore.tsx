import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CATEGORIES } from "@/constants";
import { router } from "expo-router";
import { CategoryCard, SearchBar } from "@/components/explore";

export default function ExploreScreen() {
  return (
    <SafeAreaView style={s.screen} edges={["top"]}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>Explore</Text>
          <Text style={s.sub}>Find podcasts by category</Text>
        </View>

        {/* Search */}
        <View style={s.searchWrap}>
          <SearchBar />
        </View>

        {/* Category grid */}
        <Text style={s.gridLabel}>Categories</Text>
        <View style={s.grid}>
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.name}
              category={cat}
              onPress={() =>
                router.push({
                  pathname: "/category/[name]" as any,
                  params: { name: cat.name },
                })
              }
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F5F5" },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  header: { paddingTop: 20, marginBottom: 20 },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    color: "#111111",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  sub: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#888888",
  },
  searchWrap: { marginBottom: 28 },
  gridLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: "#888888",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});
