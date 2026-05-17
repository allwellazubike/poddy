import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { apiFetch, cleanFilename, timeAgo } from "@/utils";
import { Podcast } from "@/types/podcast";

const FILTERS = ["All", "Done", "Processing"] as const;

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

  useEffect(() => { loadLibrary(); }, [loadLibrary]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadLibrary();
  }, [loadLibrary]);

  const filtered = useMemo(() => {
    if (activeFilter === "All") return podcasts;
    if (activeFilter === "Done") return podcasts.filter((p) => p.status === "done");
    return podcasts.filter((p) => p.status !== "done" && p.status !== "failed");
  }, [podcasts, activeFilter]);

  return (
    <SafeAreaView style={s.screen} edges={["top"]}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>Library</Text>
        <Text style={s.sub}>Your generated podcasts</Text>
      </View>

      {/* Filter chips */}
      <View style={s.filters}>
        {FILTERS.map((f) => {
          const active = activeFilter === f;
          return (
            <Pressable
              key={f}
              onPress={() => setActiveFilter(f)}
              style={[s.chip, active && s.chipActive]}
            >
              <Text style={[s.chipText, active && s.chipTextActive]}>{f}</Text>
            </Pressable>
          );
        })}
      </View>

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator color="#1A1A1A" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#1A1A1A"]}
              tintColor="#1A1A1A"
            />
          }
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={s.emptyText}>No podcasts here yet.</Text>
            </View>
          }
          renderItem={({ item }) => {
            const isDone = item.status === "done";
            const isFailed = item.status === "failed";

            return (
              <Pressable
                onPress={() =>
                  router.push({
                    // @ts-ignore
                    pathname: "/player/[id]",
                    params: { id: item.id },
                  })
                }
                style={({ pressed }) => [s.row, pressed && s.pressed]}
              >
                {/* Icon */}
                <View style={s.rowIcon}>
                  <Ionicons
                    name={
                      isDone
                        ? "headset-outline"
                        : isFailed
                        ? "alert-circle-outline"
                        : "hourglass-outline"
                    }
                    size={20}
                    color="#888888"
                  />
                </View>

                {/* Info */}
                <View style={s.rowInfo}>
                  <Text style={s.rowTitle} numberOfLines={1}>
                    {cleanFilename(item.original_filename)}
                  </Text>
                  <Text style={s.rowSub}>
                    {isDone
                      ? `Ready · ${timeAgo(item.created_at)}`
                      : isFailed
                      ? "Failed"
                      : `Processing · ${timeAgo(item.created_at)}`}
                  </Text>
                </View>

                {/* Arrow */}
                {isDone && (
                  <Ionicons name="chevron-forward" size={16} color="#CCCCCC" />
                )}
              </Pressable>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F5F5" },
  header: { paddingHorizontal: 20, paddingTop: 20, marginBottom: 16 },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    color: "#111111",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  sub: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#888888",
  },

  filters: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  chipActive: { backgroundColor: "#1A1A1A", borderColor: "#1A1A1A" },
  chipText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: "#888888",
  },
  chipTextActive: { color: "#FFFFFF" },

  list: { paddingHorizontal: 20, paddingBottom: 80 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 72,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  pressed: { opacity: 0.5 },
  rowIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  rowInfo: { flex: 1, marginRight: 8 },
  rowTitle: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: "#111111",
    marginBottom: 3,
  },
  rowSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#888888",
  },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  empty: { paddingTop: 48, alignItems: "center" },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#888888",
  },
});
