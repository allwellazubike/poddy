import React from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants";
import { Podcast } from "@/types/podcast";
import { LibraryCard } from "./LibraryCard";
import { Ionicons } from "@expo/vector-icons";

interface LibrarySectionProps {
  podcasts: Podcast[];
}

export function LibrarySection({ podcasts }: LibrarySectionProps) {
  const handlePress = (podcast: Podcast) => {
    router.push({
      // @ts-ignore
      pathname: "/player/[id]",
      params: { id: podcast.id, filename: podcast.original_filename },
    });
  };

  return (
    <View style={{ marginBottom: 48, marginTop: 16 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          paddingHorizontal: 24,
          marginBottom: 24,
        }}
      >
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 16,
            color: Colors.textSecondary,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          Your Studio
        </Text>
      </View>

      <FlatList
        data={podcasts}
        keyExtractor={(item) => `lib-${item.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24 }}
        renderItem={({ item }) => (
          <LibraryCard item={item} onPress={() => handlePress(item)} />
        )}
        ListFooterComponent={
          <Pressable
            onPress={() => router.navigate("/(tabs)/create")}
            style={({ pressed }) => ({
              width: LibraryCard.CARD_WIDTH,
              padding: 24,
              borderWidth: 1,
              borderColor: Colors.border,
              borderStyle: "dashed",
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.5 : 1,
            })}
          >
            <Ionicons name="add" size={32} color={Colors.textSecondary} style={{ marginBottom: 16 }} />
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 14,
                color: Colors.textSecondary,
                letterSpacing: 0.5,
              }}
            >
              New Project
            </Text>
          </Pressable>
        }
      />
    </View>
  );
}
