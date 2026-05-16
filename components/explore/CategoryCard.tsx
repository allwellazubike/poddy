import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Category } from "@/types/podcast";
import { Colors } from "@/constants";

interface CategoryCardProps {
  category: Category;
  onPress?: () => void;
}

export function CategoryCard({ category, onPress }: CategoryCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        width: "48%",
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: pressed ? Colors.surfaceHover : Colors.bg,
      })}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: Colors.surface,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <Ionicons name={category.icon as any} size={16} color={Colors.textPrimary} />
      </View>
      <Text
        style={{
          fontFamily: "Inter_500Medium",
          fontSize: 14,
          color: Colors.textPrimary,
          flex: 1,
        }}
        numberOfLines={1}
      >
        {category.name}
      </Text>
    </Pressable>
  );
}
