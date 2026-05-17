import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Podcast } from "@/types/podcast";
import { cleanFilename } from "@/utils";

interface DiscoverCardProps {
  item: Podcast;
  onPress: () => void;
}

export function DiscoverCard({ item, onPress }: DiscoverCardProps) {
  const category = item.category || "General";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.card, pressed && s.pressed]}
    >
      <View style={s.iconWrap}>
        <Ionicons name="mic" size={22} color="#FFFFFF" />
      </View>

      <View style={s.textWrap}>
        <Text style={s.title} numberOfLines={1}>
          {cleanFilename(item.original_filename)}
        </Text>
        <Text style={s.category} numberOfLines={1}>
          {category}
        </Text>
      </View>

      <View style={s.playBtn}>
        <Ionicons name="play" size={14} color="#111111" style={{ marginLeft: 2 }} />
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  pressed: { opacity: 0.65 },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  textWrap: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#111111",
    marginBottom: 3,
  },
  category: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#888888",
  },
  playBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
});
