import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Podcast } from "@/types/podcast";
import { cleanFilename } from "@/utils";

interface DiscoverCardProps {
  item: Podcast;
  onPress: () => void;
}

export function DiscoverCard({ item, onPress }: DiscoverCardProps) {
  const category = item.category || "General";

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center bg-white rounded-[14px] p-3.5 mb-2.5 shadow-sm border border-gray-200 active:opacity-65"
      style={{ elevation: 2 }} // Fallback for Android
    >
      <View className="w-[46px] h-[46px] rounded-xl bg-gray-900 items-center justify-center mr-3.5">
        <Ionicons name="mic" size={22} color="#FFFFFF" />
      </View>

      <View className="flex-1 mr-2.5">
        <Text className="font-semibold text-[14px] text-gray-900 mb-0.5" numberOfLines={1}>
          {cleanFilename(item.original_filename)}
        </Text>
        <Text className="font-normal text-[12px] text-gray-500" numberOfLines={1}>
          {category}
        </Text>
      </View>

      <View className="w-[34px] h-[34px] rounded-full bg-gray-100 items-center justify-center">
        <Ionicons name="play" size={14} color="#111111" style={{ marginLeft: 2 }} />
      </View>
    </Pressable>
  );
}
