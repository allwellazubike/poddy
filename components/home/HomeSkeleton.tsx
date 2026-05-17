import React from "react";
import { View, StyleSheet } from "react-native";

function Block({ width, height }: { width: number | string; height: number }) {
  return (
    <View
      style={[
        s.block,
        { width: width as any, height },
      ]}
    />
  );
}

export function HomeSkeleton() {
  return (
    <View style={s.container}>
      {/* Section label */}
      <Block width={100} height={13} />
      <View style={{ height: 12 }} />

      {/* Horizontal cards -> now vertical list rows */}
      <View style={s.col}>
        {[0, 1].map((i) => (
          <View key={i} style={s.listRow}>
            <Block width={40} height={40} />
            <View style={{ flex: 1, marginLeft: 12, gap: 8 }}>
              <Block width="60%" height={13} />
              <Block width="30%" height={11} />
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 32 }} />

      {/* Section label */}
      <Block width={130} height={13} />
      <View style={{ height: 16 }} />

      {/* List rows */}
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={s.listRow}>
          <Block width={44} height={44} />
          <View style={{ flex: 1, marginLeft: 12, gap: 8 }}>
            <Block width="70%" height={13} />
            <Block width="40%" height={11} />
          </View>
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 8 },
  block: {
    backgroundColor: "#E8E8E8",
    borderRadius: 4,
  },
  col: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  card: {
    width: 140,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    overflow: "hidden",
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
});
