import React from "react";
import { View, ScrollView, Dimensions } from "react-native";
import { SkeletonPulse } from "@/components/ui";

const CARD_W = Dimensions.get("window").width * 0.38;

/**
 * Full-page skeleton shown while the Home screen data is loading.
 * Mirrors the layout of the recent carousel + discover list.
 */
export function HomeSkeleton() {
  return (
    <View className="px-5">
      {/* Recent section skeleton */}
      <SkeletonPulse width={100} height={16} marginBottom={12} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-8"
      >
        {[0, 1, 2].map((i) => (
          <View key={i} style={{ width: CARD_W, marginRight: 12 }}>
            <SkeletonPulse width={CARD_W} height={CARD_W} borderRadius={16} />
            <View className="p-3">
              <SkeletonPulse width="80%" height={12} marginBottom={6} />
              <SkeletonPulse width="40%" height={10} />
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Discover section skeleton */}
      <SkeletonPulse width={120} height={16} marginBottom={12} />
      {[0, 1, 2, 3].map((i) => (
        <View key={i} className="flex-row items-center mb-3">
          <SkeletonPulse width={40} height={40} borderRadius={20} />
          <View className="flex-1 ml-3">
            <SkeletonPulse width="75%" height={14} marginBottom={6} />
            <SkeletonPulse width="50%" height={10} />
          </View>
        </View>
      ))}
    </View>
  );
}
