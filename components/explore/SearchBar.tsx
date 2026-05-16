import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants";

interface SearchBarProps {
  placeholder?: string;
  onPress?: () => void;
}

export function SearchBar({
  placeholder = "Search podcasts...",
  onPress,
}: SearchBarProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        opacity: pressed ? 0.5 : 1,
      })}
    >
      <Ionicons name="search" size={20} color={Colors.textSecondary} />
      <Text
        style={{
          fontFamily: "Inter_400Regular",
          fontSize: 16,
          color: Colors.textSecondary,
          marginLeft: 12,
        }}
      >
        {placeholder}
      </Text>
    </Pressable>
  );
}
