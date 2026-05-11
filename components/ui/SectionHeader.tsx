import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
}

/**
 * A consistent section header with an optional "See all" link.
 * Used across Home, Library, and Explore screens.
 */
export function SectionHeader({ title, onSeeAll }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-3">
      <Text className="text-poddy-text-primary text-[18px] font-bold tracking-tight">
        {title}
      </Text>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll} activeOpacity={0.6}>
          <Text className="text-poddy-accent text-[13px] font-medium">
            See all
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
