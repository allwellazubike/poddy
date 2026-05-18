import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Category } from "@/types/podcast";

interface CategoryCardProps {
  category: Category;
  onPress?: () => void;
}

export function CategoryCard({ category, onPress }: CategoryCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{ width: "48%" }}
      className="active:opacity-65"
    >
      <View
        className="bg-white border border-gray-200 rounded-xl p-3 flex-row items-center shadow-sm"
        style={{ elevation: 2 }}
      >
        <View className="w-9 h-9 rounded-[10px] bg-gray-100 items-center justify-center mr-2.5">
          <Ionicons name={category.icon as any} size={18} color="#111111" />
        </View>
        <Text className="text-gray-900 text-[13px] font-semibold flex-1" numberOfLines={1}>
          {category.name}
        </Text>
      </View>
    </Pressable>
  );
}
