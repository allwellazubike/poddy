import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { SectionHeader } from "@/components/ui";
import { DiscoverRow } from "./DiscoverRow";
import { Podcast } from "@/types/podcast";

interface DiscoverSectionProps {
  podcasts: Podcast[];
}

/**
 * The "Discover" section showing public podcasts from the community feed.
 * Renders a section header + a vertical list of DiscoverRows.
 */
export function DiscoverSection({ podcasts }: DiscoverSectionProps) {
  if (podcasts.length === 0) return null;

  return (
    <View className="px-5">
      <SectionHeader title="Discover" />
      {podcasts.map((item) => (
        <DiscoverRow
          key={item.id}
          item={item}
          onPress={() => {
            router.push({
              // @ts-ignore
              pathname: "/player/[id]",
              params: { id: item.id },
            });
          }}
        />
      ))}
    </View>
  );
}
