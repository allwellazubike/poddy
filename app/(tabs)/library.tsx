import {
  EmptyState,
  FilterPill,
  ScreenHeader,
  SkeletonPulse,
} from "@/components/ui";
import { Colors } from "@/constants";
import { Podcast } from "@/types/podcast";
import { apiFetch, cleanFilename, timeAgo } from "@/utils";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FILTER_OPTIONS = ["All", "Done", "Processing"] as const;

export default function LibraryScreen() {


  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadLibrary = useCallback(async () => {
    try {
      const data = await apiFetch<Podcast[]>("/");
      setPodcasts(data);
    } catch (err) {
      console.error("Failed to load library:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadLibrary();
  }, [loadLibrary]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadLibrary();
  }, [loadLibrary]);

  // Client-side filtering based on active pill
  const filtered = useMemo(() => {
    if (activeFilter === "All") return podcasts;
    if (activeFilter === "Done")
      return podcasts.filter((p) => p.status === "done");
    // "Processing" = any status that isn't "done" or "failed"
    return podcasts.filter((p) => p.status !== "done" && p.status !== "failed");
  }, [podcasts, activeFilter]);

  const handlePress = (podcast: Podcast) => {
    router.push({
      // @ts-ignore
      pathname: "/player/[id]",
      params: { id: podcast.id },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-poddy-bg" edges={["top"]}>
      <ScreenHeader title="Library" subtitle="Your generated podcasts" />

      {/* Filter pills */}
      <View className="flex-row px-5 mb-4">
        {FILTER_OPTIONS.map((label) => (
          <FilterPill
            key={label}
            label={label}
            active={activeFilter === label}
            onPress={() => setActiveFilter(label)}
          />
        ))}
      </View>

      {loading ? (
        /* Skeleton loading */
        <View className="px-5">
          {[0, 1, 2, 3].map((i) => (
            <View key={i} className="flex-row items-center mb-3">
              <SkeletonPulse width={44} height={44} borderRadius={12} />
              <View className="flex-1 ml-3">
                <SkeletonPulse width="75%" height={14} marginBottom={6} />
                <SkeletonPulse width="40%" height={10} />
              </View>
            </View>
          ))}
        </View>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="library-outline"
          title="No podcasts yet"
          message={
            activeFilter === "All"
              ? "Your generated podcasts will appear here."
              : `No ${activeFilter.toLowerCase()} podcasts found.`
          }
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.accent}
              colors={[Colors.accent]}
            />
          }
          renderItem={({ item }) => {
            const isDone = item.status === "done";
            const statusColor = isDone ? "#059669" : Colors.accent;

            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handlePress(item)}
              >
                <View className="flex-row items-center bg-poddy-surface border border-poddy-border rounded-xl px-4 py-3.5 mb-2">
                  {/* Icon */}
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      backgroundColor: Colors.accentSoft,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                    }}
                  >
                    <Ionicons
                      name={isDone ? "headset" : "hourglass-outline"}
                      size={20}
                      color={statusColor}
                    />
                  </View>

                  {/* Info */}
                  <View className="flex-1 mr-3">
                    <Text
                      className="text-poddy-text-primary text-[14px] font-semibold leading-5 mb-1"
                      numberOfLines={1}
                    >
                      {cleanFilename(item.original_filename)}
                    </Text>
                    <View className="flex-row items-center">
                      <View
                        style={{
                          backgroundColor: statusColor + "18",
                          borderRadius: 4,
                          paddingHorizontal: 6,
                          paddingVertical: 1,
                        }}
                      >
                        <Text
                          style={{
                            color: statusColor,
                            fontSize: 10,
                            fontWeight: "600",
                            textTransform: "capitalize",
                          }}
                        >
                          {item.status}
                        </Text>
                      </View>
                      <View className="w-1 h-1 rounded-full bg-poddy-text-muted mx-1.5" />
                      <Text className="text-poddy-text-muted text-[11px]">
                        {timeAgo(item.created_at)}
                      </Text>
                    </View>
                  </View>

                  {/* Action */}
                  {isDone && (
                    <Ionicons
                      name="play-circle"
                      size={28}
                      color={Colors.accent}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
