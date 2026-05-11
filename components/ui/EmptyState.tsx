import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants";

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
}

/**
 * A centered empty-state placeholder with an icon, title, and message.
 * Used when a list has no data to display.
 */
export function EmptyState({ icon, title, message }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <View className="w-16 h-16 rounded-2xl bg-poddy-surface border border-poddy-border items-center justify-center mb-5">
        <Ionicons name={icon} size={28} color={Colors.textMuted} />
      </View>
      <Text className="text-poddy-text-primary text-[17px] font-semibold mb-2">
        {title}
      </Text>
      <Text className="text-poddy-text-secondary text-[14px] text-center leading-5">
        {message}
      </Text>
    </View>
  );
}
