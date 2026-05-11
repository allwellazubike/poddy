import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants";
import { Podcast } from "@/types/podcast";
import { cleanFilename, timeAgo } from "@/utils";

const CARD_WIDTH = Dimensions.get("window").width * 0.38;

interface RecentCardProps {
  item: Podcast;
  onPress: () => void;
}

/**
 * A compact card shown in the horizontal "Your Recent" carousel.
 * Displays the podcast thumbnail, title, and relative timestamp.
 */
export function RecentCard({ item, onPress }: RecentCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <View
        style={{ width: CARD_WIDTH }}
        className="bg-poddy-surface border border-poddy-border rounded-2xl mr-3 overflow-hidden"
      >
        {/* Thumbnail area */}
        <View className="w-full aspect-square bg-poddy-accent-soft items-center justify-center">
          <Ionicons name="headset" size={28} color={Colors.accent} />
        </View>

        {/* Info */}
        <View className="p-3">
          <Text
            className="text-poddy-text-primary text-[13px] font-semibold leading-4 mb-1"
            numberOfLines={2}
          >
            {cleanFilename(item.original_filename)}
          </Text>
          <Text className="text-poddy-text-muted text-[11px]">
            {timeAgo(item.created_at)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

/** The fixed card width, exported so the skeleton can match it. */
RecentCard.CARD_WIDTH = CARD_WIDTH;
