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
        <Text style={s.sub}>All your generated podcasts</Text>
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
          <ActivityIndicator color="#111111" size="large" />
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
              colors={["#111111"]}
              tintColor="#111111"
            />
          }
          ListEmptyComponent={
            <View style={s.empty}>
              <View style={s.emptyIcon}>
                <Ionicons name="library-outline" size={28} color="#888888" />
              </View>
              <Text style={s.emptyTitle}>Nothing here yet</Text>
              <Text style={s.emptyText}>
                {activeFilter === "All"
                  ? "Your podcasts will show up here once created."
                  : `No ${activeFilter.toLowerCase()} podcasts.`}
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const isDone = item.status === "done";
            const isFailed = item.status === "failed";
            const statusLabel = isDone ? "Ready" : isFailed ? "Failed" : "Processing…";
            const statusColor = isDone ? "#15803D" : isFailed ? "#DC2626" : "#D97706";

            return (
              <Pressable
                onPress={() =>
                  router.push({
                    // @ts-ignore
                    pathname: "/player/[id]",
                    params: { id: item.id },
                  })
                }
                style={({ pressed }) => [s.card, pressed && s.pressed]}
              >
                {/* Icon */}
                <View style={[s.iconWrap, isFailed && s.iconFailed, !isDone && !isFailed && s.iconProcessing]}>
                  <Ionicons
                    name={isDone ? "headset" : isFailed ? "alert-circle" : "hourglass"}
                    size={22}
                    color={isDone ? "#FFFFFF" : isFailed ? "#DC2626" : "#D97706"}
                  />
                </View>

                {/* Info */}
                <View style={s.info}>
                  <Text style={s.itemTitle} numberOfLines={1}>
                    {cleanFilename(item.original_filename)}
                  </Text>
                  <View style={s.statusRow}>
                    <View style={[s.statusDot, { backgroundColor: statusColor }]} />
                    <Text style={[s.statusText, { color: statusColor }]}>{statusLabel}</Text>
                    <Text style={s.dot}>·</Text>
                    <Text style={s.time}>{timeAgo(item.created_at)}</Text>
                  </View>
                </View>

                {/* Action */}
                {isDone && (
                  <View style={s.chevron}>
                    <Ionicons name="chevron-forward" size={18} color="#AAAAAA" />
                  </View>
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
    fontSize: 26,
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  chipActive: { backgroundColor: "#111111", elevation: 0 },
  chipText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: "#555555",
  },
  chipTextActive: { color: "#FFFFFF" },

  list: { paddingHorizontal: 20, paddingBottom: 100, gap: 10 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  pressed: { opacity: 0.65 },

  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  iconFailed: { backgroundColor: "#FEF2F2" },
  iconProcessing: { backgroundColor: "#FFFBEB" },

  info: { flex: 1, marginRight: 8 },
  itemTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#111111",
    marginBottom: 4,
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
    fontSize: 12,
  },
  dot: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#CCCCCC",
  },
  time: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#888888",
  },

  chevron: {},

  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  empty: { paddingTop: 60, alignItems: "center", paddingHorizontal: 40 },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  emptyTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: "#111111",
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#888888",
    textAlign: "center",
    lineHeight: 20,
  },
});
