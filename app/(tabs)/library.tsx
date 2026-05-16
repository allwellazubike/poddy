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
  Pressable,
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
      const data = await apiFetch<Podcast[]>("/podcasts");
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

  const filtered = useMemo(() => {
    if (activeFilter === "All") return podcasts;
    if (activeFilter === "Done") return podcasts.filter((p) => p.status === "done");
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
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }} edges={["top"]}>
      <View style={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24 }}>
        <Text
          style={{
            fontFamily: "Inter_800ExtraBold",
            fontSize: 40,
            color: Colors.textPrimary,
            letterSpacing: -1,
            marginBottom: 8,
          }}
        >
          Library
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 16,
            color: Colors.textSecondary,
          }}
        >
          Your generated podcasts.
        </Text>
      </View>

      {/* Filter pills */}
      <View style={{ flexDirection: "row", paddingHorizontal: 24, marginBottom: 24 }}>
        {FILTER_OPTIONS.map((label) => {
          const isActive = activeFilter === label;
          return (
            <Pressable
              key={label}
              onPress={() => setActiveFilter(label)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderWidth: 1,
                borderColor: isActive ? Colors.textPrimary : Colors.border,
                backgroundColor: isActive ? Colors.textPrimary : "transparent",
                borderRadius: 20,
                marginRight: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 13,
                  color: isActive ? Colors.bg : Colors.textPrimary,
                }}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 80 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.textPrimary}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={{ marginTop: 48, alignItems: "flex-start" }}>
              <Text style={{ fontFamily: "Inter_500Medium", fontSize: 16, color: Colors.textSecondary }}>
                No podcasts found in this category.
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          const isDone = item.status === "done";
          
          return (
            <Pressable
              onPress={() => handlePress(item)}
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
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      fontFamily: "Inter_500Medium",
                      fontSize: 12,
                      color: isDone ? Colors.textSecondary : Colors.textPrimary,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    {item.status}
                  </Text>
                  <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textMuted, marginLeft: 8 }}>
                    • {timeAgo(item.created_at)}
                  </Text>
                </View>
              </View>

              {isDone && (
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
              )}
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}
