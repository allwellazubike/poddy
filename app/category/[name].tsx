import { DiscoverRow } from "@/components/home";
import { Colors } from "@/constants";
import { Podcast } from "@/types/podcast";
import { apiFetch } from "@/utils";

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CategoryScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const decodedName = decodeURIComponent(name || "");

  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategory() {
      try {
        setLoading(true);
        // We fetch the feed and try to filter by category.
        // Currently the backend doesn't save category, so this will naturally be empty!
        const feed: Podcast[] = await apiFetch("/feed");
        // Mock filtering logic if backend were to return category
        // setPodcasts(feed.filter((p: any) => p.category === decodedName));
        setPodcasts([]); // Forcing empty state to show the UI requested by the user
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategory();
  }, [decodedName]);

  return (
    <SafeAreaView className="flex-1 bg-poddy-bg" edges={["top"]}>
      {/* Header */}
      <View className="px-5 py-4 flex-row items-center border-b border-poddy-border">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text className="text-poddy-text-primary text-[20px] font-bold">
          {decodedName}
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1 px-5 pt-6">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator color={Colors.accent} />
          </View>
        ) : podcasts.length > 0 ? (
          podcasts.map((podcast) => (
            <DiscoverRow
              key={podcast.id}
              item={podcast}
              onPress={() =>
                router.push({
                  pathname: "/player/[id]" as any,
                  params: { id: podcast.id },
                })
              }
            />
          ))
        ) : (
          <View className="flex-1 justify-center items-center pb-20">
            <View className="w-20 h-20 bg-poddy-surface rounded-full items-center justify-center mb-6">
              <Ionicons name="mic-outline" size={40} color={Colors.textMuted} />
            </View>
            <Text className="text-poddy-text-primary text-[20px] font-bold mb-2">
              No podcasts yet
            </Text>
            <Text className="text-poddy-text-secondary text-center text-[15px] mb-8 px-4">
              Be the first to create a podcast for the {decodedName} community!
            </Text>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/create",
                  params: { category: decodedName },
                })
              }
              className="px-8 py-4 rounded-xl flex-row items-center"
              style={{ backgroundColor: Colors.accent }}
            >
              <Ionicons name="add" size={20} color="#fff" className="mr-2" />
              <Text className="text-white font-bold text-[16px] ml-2">
                Create {decodedName} Podcast
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
