import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CATEGORIES } from "@/constants";
import { router } from "expo-router";
import { CategoryCard, SearchBar } from "@/components/explore";
import { DiscoverCard } from "@/components/home";
import { apiFetch } from "@/utils";
import { Podcast } from "@/types/podcast";

export default function ExploreScreen() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Podcast[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      setHasSearched(false);
      setResults([]);
      return;
    }
    
    setIsSearching(true);
    setHasSearched(true);
    try {
      const data = await apiFetch<Podcast[]>(`/podcasts/feed?q=${encodeURIComponent(query.trim())}`);
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

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
          <SearchBar
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              if (text === "") {
                setHasSearched(false);
                setResults([]);
              }
            }}
            onSubmitEditing={handleSearch}
            placeholder="Search podcasts…"
          />
        </View>

        {isSearching ? (
          <View style={{ marginTop: 40, alignItems: "center" }}>
            <ActivityIndicator size="large" color="#111111" />
          </View>
        ) : hasSearched && query.trim() !== "" ? (
          <View>
            <Text style={s.gridLabel}>Search Results</Text>
            {results.length > 0 ? (
              results.map((item) => (
                <DiscoverCard
                  key={item.id}
                  item={item}
                  onPress={() =>
                    router.push({
                      // @ts-ignore
                      pathname: "/player/[id]",
                      params: { id: item.id },
                    })
                  }
                />
              ))
            ) : (
              <Text style={{ fontFamily: "Inter_400Regular", color: "#888888", textAlign: "center", marginTop: 20 }}>
                No podcasts found matching "{query}"
              </Text>
            )}
          </View>
        ) : (
          <>
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
          </>
        )}
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
