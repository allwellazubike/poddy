import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  /** Show the profile avatar button on the right. */
  showProfile?: boolean;
  onProfilePress?: () => void;
}

/**
 * Top-level screen header with title, optional subtitle,
 * and an optional profile avatar button.
 */
export function ScreenHeader({
  title,
  subtitle,
  showProfile = false,
  onProfilePress,
}: ScreenHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-5 pt-4 pb-5">
      <View>
        <Text className="text-poddy-text-primary text-[24px] font-bold tracking-tight">
          {title}
        </Text>
        {subtitle && (
          <Text className="text-poddy-text-secondary text-[14px] mt-1">
            {subtitle}
          </Text>
        )}
      </View>
      {showProfile && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onProfilePress}
          className="w-9 h-9 rounded-full bg-poddy-surface border border-poddy-border items-center justify-center"
        >
          <Ionicons name="person" size={16} color={Colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}
