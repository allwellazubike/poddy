import React from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Podcast } from "@/types/podcast";
import { LibraryCard, CARD_WIDTH } from "./LibraryCard";

interface LibrarySectionProps {
  podcasts: Podcast[];
}

export function LibrarySection({ podcasts }: LibrarySectionProps) {
  return (
    <View className="mb-8">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 mb-4">
        <Text className="font-semibold text-[17px] text-gray-900 tracking-tight">
          Your podcasts
        </Text>
        <Pressable
          onPress={() => router.navigate("/(tabs)/library")}
          className="py-1 active:opacity-50"
          hitSlop={8}
        >
          <Text className="font-medium text-[13px] text-gray-500">See all</Text>
        </Pressable>
      </View>

      {/* Horizontal scroll */}
      <FlatList
        data={podcasts}
        keyExtractor={(item) => `lib-${item.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 10 }}
        renderItem={({ item }) => (
          <LibraryCard
            item={item}
            onPress={() =>
              router.push({
                // @ts-ignore
                pathname: "/player/[id]",
                params: { id: item.id },
              })
            }
          />
        )}
        ListFooterComponent={
          <Pressable
            onPress={() => router.navigate("/(tabs)/create")}
            className="w-[160px] h-[178px] rounded-[14px] border-2 border-dashed border-gray-300 bg-gray-50 items-center justify-center active:opacity-60"
          >
            <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center mb-2">
              <Ionicons name="add" size={26} color="#888888" />
            </View>
            <Text className="font-medium text-[13px] text-gray-500">New podcast</Text>
          </Pressable>
        }
      />
    </View>
  );
}
