import React from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants";
import { Podcast } from "@/types/podcast";
import { cleanFilename } from "@/utils";

const CARD_WIDTH = Dimensions.get("window").width * 0.7;

interface LibraryCardProps {
  item: Podcast;
  onPress: () => void;
}

export function LibraryCard({ item, onPress }: LibraryCardProps) {
  const isDone = item.status === "done";
  const isFailed = item.status === "failed";
  const isProcessing = !isDone && !isFailed;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        width: CARD_WIDTH,
        marginRight: 16,
        padding: 20,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      {/* Type / Category Label */}
      <Text
        style={{
          fontFamily: "Inter_500Medium",
          fontSize: 10,
          color: Colors.textSecondary,
          textTransform: "uppercase",
          letterSpacing: 2,
          marginBottom: 16,
        }}
      >
        Recent
      </Text>

      {/* Title */}
      <Text
        style={{
          fontFamily: "Inter_700Bold",
          fontSize: 20,
          color: Colors.textPrimary,
          lineHeight: 28,
          marginBottom: 32,
        }}
        numberOfLines={2}
      >
        {cleanFilename(item.original_filename)}
      </Text>

      {/* Footer / Status */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: "auto" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {isDone ? (
            <Text style={{ fontFamily: "Inter_500Medium", fontSize: 12, color: Colors.textSecondary }}>
              Ready to play
            </Text>
          ) : isProcessing ? (
            <Text style={{ fontFamily: "Inter_500Medium", fontSize: 12, color: Colors.textPrimary }}>
              Processing...
            </Text>
          ) : (
            <Text style={{ fontFamily: "Inter_500Medium", fontSize: 12, color: "#EF4444" }}>
              Failed
            </Text>
          )}
        </View>

        {isDone && (
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: Colors.textPrimary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="play" size={14} color={Colors.bg} style={{ marginLeft: 2 }} />
          </View>
        )}
      </View>
    </Pressable>
  );
}

LibraryCard.CARD_WIDTH = CARD_WIDTH;
