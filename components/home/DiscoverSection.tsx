import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Podcast } from "@/types/podcast";
import { DiscoverCard } from "./DiscoverCard";

interface DiscoverSectionProps {
  podcasts: Podcast[];
}

export function DiscoverSection({ podcasts }: DiscoverSectionProps) {
  if (podcasts.length === 0) return null;

  return (
    <View style={s.container}>
      <Text style={s.title}>From the community</Text>

      {podcasts.map((item) => (
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
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  title: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 17,
    color: "#111111",
    letterSpacing: -0.3,
    marginBottom: 14,
  },
});
