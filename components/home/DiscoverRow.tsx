import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants";
import { PublicPodcast } from "@/types/podcast";
import { getNicheColor, formatPlays } from "@/utils";

interface DiscoverRowProps {
  item: PublicPodcast;
  onPress: () => void;
}

/**
 * A single row in the Discover feed showing a public podcast
 * with creator avatar, niche badge, duration, and play count.
 */
export function DiscoverRow({ item, onPress }: DiscoverRowProps) {
  const nicheColor = getNicheColor(item.niche);

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <View className="flex-row items-center bg-poddy-surface border border-poddy-border rounded-xl px-4 py-3.5 mb-2">
        {/* Creator avatar */}
        <View
          style={{
            backgroundColor: nicheColor + "18",
            borderWidth: 1,
            borderColor: nicheColor + "30",
          }}
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
        >
          <Text style={{ color: nicheColor, fontSize: 14, fontWeight: "700" }}>
            {item.creator[0]}
          </Text>
        </View>

        {/* Content */}
        <View className="flex-1 mr-3">
          <Text
            className="text-poddy-text-primary text-[14px] font-semibold leading-5 mb-1"
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <View className="flex-row items-center">
            <Text className="text-poddy-text-secondary text-[12px]">
              {item.creator}
            </Text>
            <View className="w-1 h-1 rounded-full bg-poddy-text-muted mx-1.5" />
            <View
              style={{
                backgroundColor: nicheColor + "14",
                borderRadius: 4,
                paddingHorizontal: 5,
                paddingVertical: 1,
              }}
            >
              <Text style={{ color: nicheColor, fontSize: 10, fontWeight: "600" }}>
                {item.niche}
              </Text>
            </View>
            <View className="w-1 h-1 rounded-full bg-poddy-text-muted mx-1.5" />
            <Text className="text-poddy-text-muted text-[11px]">
              {item.duration}
            </Text>
          </View>
        </View>

        {/* Play button + stats */}
        <View className="items-end">
          <Ionicons name="play-circle" size={28} color={Colors.accent} />
          <Text className="text-poddy-text-muted text-[10px] mt-1">
            {formatPlays(item.plays)} plays
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
