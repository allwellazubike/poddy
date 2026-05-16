import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CATEGORIES, Colors } from "@/constants";
import { router } from "expo-router";
import { CategoryCard, SearchBar } from "@/components/explore";

export default function ExploreScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 24, paddingTop: 32 }}
      >
        <View style={{ marginBottom: 40 }}>
          <Text
            style={{
              fontFamily: "Inter_800ExtraBold",
              fontSize: 40,
              color: Colors.textPrimary,
              letterSpacing: -1,
              marginBottom: 8,
            }}
          >
            Explore
          </Text>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 16,
              color: Colors.textSecondary,
            }}
          >
            Browse podcasts by category.
          </Text>
        </View>

        {/* Search */}
        <View style={{ marginBottom: 40 }}>
          <SearchBar />
        </View>

        {/* Category grid */}
        <View>
          <Text
            style={{
              fontFamily: "Inter_500Medium",
              fontSize: 12,
              color: Colors.textSecondary,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 16,
            }}
          >
            Categories
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            {CATEGORIES.map((cat) => (
              <CategoryCard 
                key={cat.name} 
                category={cat} 
                onPress={() => router.push({ pathname: "/category/[name]" as any, params: { name: cat.name } })} 
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
