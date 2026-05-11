import React from "react";
import { View, FlatList } from "react-native";
import { router } from "expo-router";
import { SectionHeader } from "@/components/ui";
import { RecentCard } from "./RecentCard";
import { Podcast } from "@/types/podcast";

interface RecentSectionProps {
  podcasts: Podcast[];
}

/**
 * The "Your Recent" horizontal carousel section.
 * Renders a section header + a horizontal FlatList of RecentCards.
 */
export function RecentSection({ podcasts }: RecentSectionProps) {
  if (podcasts.length === 0) return null;

  const handlePress = (podcast: Podcast) => {
    router.push({
      // @ts-ignore — dynamic route params
      pathname: "/player/[id]",
      params: { id: podcast.id, filename: podcast.original_filename },
    });
  };

  return (
    <View className="mb-7">
      <View className="px-5">
        <SectionHeader
          title="Your Recent"
          onSeeAll={() => router.navigate("/(tabs)/library")}
        />
      </View>
      <FlatList
        data={podcasts}
        keyExtractor={(item) => `recent-${item.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        renderItem={({ item }) => (
          <RecentCard item={item} onPress={() => handlePress(item)} />
        )}
      />
    </View>
  );
}
