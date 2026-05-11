import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Category } from "@/types/podcast";

interface CategoryCardProps {
  category: Category;
  onPress?: () => void;
}

/**
 * A category tile used in the Explore grid.
 * Shows an icon with a tinted background and the category name.
 */
export function CategoryCard({ category, onPress }: CategoryCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{ width: "48%" }}
    >
      <View
        className="bg-poddy-surface border border-poddy-border rounded-xl p-4"
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: category.color + "14",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 10,
          }}
        >
          <Ionicons
            name={category.icon as any}
            size={18}
            color={category.color}
          />
        </View>
        <Text
          className="text-poddy-text-primary text-[13px] font-medium flex-1"
          numberOfLines={1}
        >
          {category.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
