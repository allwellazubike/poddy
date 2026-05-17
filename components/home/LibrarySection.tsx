import React from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Podcast } from "@/types/podcast";
import { LibraryCard, CARD_WIDTH } from "./LibraryCard";

interface LibrarySectionProps {
  podcasts: Podcast[];
}

export function LibrarySection({ podcasts }: LibrarySectionProps) {
  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>Your podcasts</Text>
        <Pressable
          onPress={() => router.navigate("/(tabs)/library")}
          style={({ pressed }) => [s.seeAll, pressed && { opacity: 0.5 }]}
          hitSlop={8}
        >
          <Text style={s.seeAllText}>See all</Text>
        </Pressable>
      </View>

      {/* Horizontal scroll */}
      <FlatList
        data={podcasts}
        keyExtractor={(item) => `lib-${item.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.list}
        renderItem={({ item }) => (
          <LibraryCard
            item={item}
            onPress={() =>
              router.push({
                // @ts-ignore
                pathname: "/player/[id]",
                params: { id: item.id },
              })
            }
          />
        )}
        ListFooterComponent={
          <Pressable
            onPress={() => router.navigate("/(tabs)/create")}
            style={({ pressed }) => [s.addCard, pressed && { opacity: 0.6 }]}
          >
            <View style={s.addIcon}>
              <Ionicons name="add" size={26} color="#888888" />
            </View>
            <Text style={s.addText}>New</Text>
          </Pressable>
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { marginBottom: 32 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 17,
    color: "#111111",
    letterSpacing: -0.3,
  },
  seeAll: { paddingVertical: 4 },
  seeAllText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: "#888888",
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 6, // room for shadow
  },
  addCard: {
    width: CARD_WIDTH,
    height: 178, // matches card (110 thumb + 12 pad + ~56 info)
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#D0D0D0",
    borderStyle: "dashed",
    backgroundColor: "#FAFAFA",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EEEEEE",
    alignItems: "center",
    justifyContent: "center",
  },
  addText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: "#888888",
  },
});
