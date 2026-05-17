import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
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
      style={({ pressed }) => [s.card, pressed && s.pressed]}
    >
      <View style={s.iconWrap}>
        <Ionicons name={category.icon as any} size={22} color="#111111" />
      </View>
      <Text style={s.label} numberOfLines={2}>
        {category.name}
      </Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    alignItems: "flex-start",
    gap: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  pressed: { opacity: 0.65 },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#111111",
    lineHeight: 20,
  },
});
