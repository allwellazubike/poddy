import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Podcast } from "@/types/podcast";
import { cleanFilename } from "@/utils";

export const CARD_WIDTH = 160;

interface LibraryCardProps {
  item: Podcast;
  onPress: () => void;
}

export function LibraryCard({ item, onPress }: LibraryCardProps) {
  const isDone = item.status === "done";
  const isFailed = item.status === "failed";
  const isProcessing = !isDone && !isFailed;

  const statusLabel = isDone ? "Ready" : isFailed ? "Failed" : "Processing…";
  const statusColor = isDone ? "#15803D" : isFailed ? "#DC2626" : "#D97706";

  return (
    <Pressable
      onPress={isDone ? onPress : undefined}
      style={({ pressed }) => [s.card, pressed && isDone && s.pressed]}
    >
      {/* Thumbnail */}
      <View style={[s.thumb, isProcessing && s.thumbProcessing, isFailed && s.thumbFailed]}>
        <Ionicons
          name={isDone ? "headset" : isFailed ? "alert-circle" : "hourglass"}
          size={28}
          color={isDone ? "#111111" : isFailed ? "#DC2626" : "#D97706"}
        />
      </View>

      {/* Info */}
      <View style={s.info}>
        <Text style={s.title} numberOfLines={2}>
          {cleanFilename(item.original_filename)}
        </Text>

        <View style={s.statusRow}>
          <View style={[s.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[s.statusText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
      </View>

      {/* Play button */}
      {isDone && (
        <View style={s.playBtn}>
          <Ionicons name="play" size={14} color="#FFFFFF" style={{ marginLeft: 2 }} />
        </View>
      )}
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginRight: 14,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  pressed: { opacity: 0.75 },

  thumb: {
    height: 110,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  thumbProcessing: { backgroundColor: "#FFFBEB" },
  thumbFailed: { backgroundColor: "#FEF2F2" },

  info: {
    padding: 12,
    gap: 6,
  },
  title: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: "#111111",
    lineHeight: 18,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
  },

  playBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },
});
