import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants";
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
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        opacity: pressed ? 0.5 : 1,
      })}
    >
      <View style={{ flex: 1, paddingRight: 16 }}>
        <Text
          style={{
            fontFamily: "Inter_600SemiBold",
            fontSize: 16,
            color: Colors.textPrimary,
            marginBottom: 4,
          }}
          numberOfLines={1}
        >
          {cleanFilename(item.original_filename)}
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 12,
            color: Colors.textSecondary,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
          numberOfLines={1}
        >
          {category}
        </Text>
      </View>

      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: Colors.surfaceHover,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="play" size={16} color={Colors.textPrimary} style={{ marginLeft: 2 }} />
      </View>
    </Pressable>
  );
}
