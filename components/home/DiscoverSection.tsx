import React from "react";
import { View, Text } from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants";
import { DiscoverCard } from "./DiscoverCard";
import { Podcast } from "@/types/podcast";

interface DiscoverSectionProps {
  podcasts: Podcast[];
}

export function DiscoverSection({ podcasts }: DiscoverSectionProps) {
  if (podcasts.length === 0) return null;

  return (
    <View style={{ paddingHorizontal: 24, paddingBottom: 48 }}>
      <Text
        style={{
          fontFamily: "Inter_400Regular",
          fontSize: 16,
          color: Colors.textSecondary,
          textTransform: "uppercase",
          letterSpacing: 2,
          marginBottom: 16,
        }}
      >
        Community Feed
      </Text>
      {podcasts.map((item) => (
        <DiscoverCard
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
