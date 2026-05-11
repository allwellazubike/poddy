import React from "react";
import { View } from "react-native";
import { SectionHeader } from "@/components/ui";
import { DiscoverRow } from "./DiscoverRow";
import { PublicPodcast } from "@/types/podcast";

interface DiscoverSectionProps {
  podcasts: PublicPodcast[];
}

/**
 * The "Discover" section showing public podcasts from other users.
 * Renders a section header + a vertical list of DiscoverRows.
 */
export function DiscoverSection({ podcasts }: DiscoverSectionProps) {
  return (
    <View className="px-5">
      <SectionHeader title="Discover" />
      {podcasts.map((item) => (
        <DiscoverRow
          key={item.id}
          item={item}
          onPress={() => {
            /* TODO: navigate to public podcast player */
          }}
        />
      ))}
    </View>
  );
}
