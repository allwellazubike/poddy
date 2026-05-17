import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Podcast } from "@/types/podcast";
import { cleanFilename, timeAgo } from "@/utils";

interface DiscoverRowProps {
  item: Podcast;
  onPress: () => void;
}

/** Used in the Category screen — same list row style as DiscoverCard. */
export function DiscoverRow({ item, onPress }: DiscoverRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.row, pressed && s.pressed]}
    >
      <View style={s.icon}>
        <Ionicons name="mic-outline" size={20} color="#888888" />
      </View>

      <View style={s.text}>
        <Text style={s.title} numberOfLines={1}>
          {cleanFilename(item.original_filename)}
        </Text>
        <Text style={s.sub}>{timeAgo(item.created_at)}</Text>
      </View>

      <Ionicons name="play-circle-outline" size={24} color="#AAAAAA" />
    </Pressable>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 72,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  pressed: { opacity: 0.5 },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  text: { flex: 1, marginRight: 12 },
  title: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: "#111111",
    marginBottom: 3,
  },
  sub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#888888",
  },
});
