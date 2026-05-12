import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants";
import { Podcast } from "@/types/podcast";
import { cleanFilename, timeAgo } from "@/utils";

interface DiscoverRowProps {
  item: Podcast;
  onPress: () => void;
}

/**
 * A single row in the Discover feed showing a public podcast.
 * Displays the filename, status badge, and relative timestamp.
 */
export function DiscoverRow({ item, onPress }: DiscoverRowProps) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <View className="flex-row items-center bg-poddy-surface border border-poddy-border rounded-xl px-4 py-3.5 mb-2">
        {/* Podcast icon */}
        <View
          style={{
            backgroundColor: Colors.accentSoft,
            borderWidth: 1,
            borderColor: Colors.accent + "30",
          }}
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
        >
          <Ionicons name="musical-notes" size={18} color={Colors.accent} />
        </View>

        {/* Content */}
        <View className="flex-1 mr-3">
          <Text
            className="text-poddy-text-primary text-[14px] font-semibold leading-5 mb-1"
            numberOfLines={1}
          >
            {cleanFilename(item.original_filename)}
          </Text>
          <View className="flex-row items-center">
            <Text className="text-poddy-text-muted text-[11px]">
              {timeAgo(item.created_at)}
            </Text>
          </View>
        </View>

        {/* Play button */}
        <View className="items-end">
          <Ionicons name="play-circle" size={28} color={Colors.accent} />
        </View>
      </View>
    </TouchableOpacity>
  );
}
