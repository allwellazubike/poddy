import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";

function Bone({ w, h, r = 8 }: { w: number | string; h: number; r?: number }) {
  return (
    <View style={{ width: w as any, height: h, borderRadius: r, backgroundColor: "#E8E8E8" }} />
  );
}

export function HomeSkeleton() {
  return (
    <View style={s.container}>
      {/* "Your podcasts" heading */}
      <Bone w={120} h={14} />
      <View style={{ height: 16 }} />

      {/* Horizontal card skeletons */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginLeft: -20 }}>
        <View style={{ flexDirection: "row", paddingHorizontal: 20, gap: 14 }}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={s.card}>
              <View style={s.cardThumb} />
              <View style={{ padding: 12, gap: 8 }}>
                <Bone w="80%" h={13} />
                <Bone w="45%" h={11} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={{ height: 32 }} />

      {/* "Community" heading */}
      <Bone w={150} h={14} />
      <View style={{ height: 16 }} />

      {/* Community card skeletons */}
      {[0, 1, 2].map((i) => (
        <View key={i} style={s.listCard}>
          <View style={s.listIcon} />
          <View style={{ flex: 1, gap: 8, marginLeft: 14 }}>
            <Bone w="70%" h={13} />
            <Bone w="40%" h={11} />
          </View>
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 8 },
  card: {
    width: 160,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  cardThumb: {
    height: 110,
    backgroundColor: "#F0F0F0",
  },
  listCard: {
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
  listIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#E8E8E8",
  },
});
