import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants";

interface SearchBarProps {
  placeholder?: string;
  onPress?: () => void;
}

/**
 * A tappable search bar placeholder. Currently non-functional
 * (opens search screen on press in the future).
 */
export function SearchBar({
  placeholder = "Search podcasts...",
  onPress,
}: SearchBarProps) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <View className="flex-row items-center bg-poddy-surface border border-poddy-border rounded-xl px-4 py-3">
        <Ionicons name="search" size={18} color={Colors.textMuted} />
        <Text className="text-poddy-text-muted text-[14px] ml-3">
          {placeholder}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
