import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Podcast } from "@/types/podcast";
import { cleanFilename } from "@/utils";

export const CARD_WIDTH = 160;

interface LibraryCardProps {
  item: Podcast;
  onPress: () => void;
}

export function LibraryCard({ item, onPress }: LibraryCardProps) {
  const isDone = item.status === "done";
  const isFailed = item.status === "failed";
  const isProcessing = !isDone && !isFailed;

  const statusLabel = isDone ? "Ready" : isFailed ? "Failed" : "Processing…";
  
  // Dynamic tailwind classes based on status
  const thumbBg = isDone ? "bg-gray-100" : isFailed ? "bg-red-50" : "bg-amber-50";
  const statusColorClass = isDone ? "bg-green-700" : isFailed ? "bg-red-600" : "bg-amber-500";
  const statusTextColorClass = isDone ? "text-green-700" : isFailed ? "text-red-600" : "text-amber-600";
  const iconColor = isDone ? "#111111" : isFailed ? "#DC2626" : "#D97706";

  return (
    <Pressable
      onPress={isDone ? onPress : undefined}
      className={`w-[160px] bg-white rounded-[14px] mr-3.5 overflow-hidden shadow-sm border border-gray-200 ${
        isDone ? "active:opacity-75" : ""
      }`}
      style={{ elevation: 2 }} // Fallback for Android elevation
    >
      {/* Thumbnail */}
      <View className={`h-[110px] items-center justify-center ${thumbBg}`}>
        <Ionicons
          name={isDone ? "headset" : isFailed ? "alert-circle" : "hourglass"}
          size={28}
          color={iconColor}
        />
      </View>

      {/* Info */}
      <View className="p-3">
        <Text className="font-semibold text-[13px] text-gray-900 leading-snug mb-1.5" numberOfLines={2}>
          {cleanFilename(item.original_filename)}
        </Text>

        <View className="flex-row items-center">
          <View className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusColorClass}`} />
          <Text className={`font-medium text-[11px] ${statusTextColorClass}`}>
            {statusLabel}
          </Text>
        </View>
      </View>

      {/* Play button overlay */}
      {isDone && (
        <View className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-gray-900 items-center justify-center shadow-md">
          <Ionicons name="play" size={12} color="#FFFFFF" style={{ marginLeft: 2 }} />
        </View>
      )}
    </Pressable>
  );
}
