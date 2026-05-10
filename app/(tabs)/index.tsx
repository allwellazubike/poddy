import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const API_BASE = "http://YOUR_BACKEND_IP:5000";

// ─── Types ──────────────────────────────────────────────────────────

interface Podcast {
  id: string;
  original_filename: string;
  status: string;
  audio_url: string | null;
  created_at: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────

const MOCK_PODCASTS: Podcast[] = [
  {
    id: "1",
    original_filename: "Biology Chapter 5 - Cell Division and Mitosis.pdf",
    status: "done",
    audio_url: "audio/1.mp3",
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    original_filename: "Computer Science - Data Structures and Algorithms.pdf",
    status: "done",
    audio_url: "audio/2.mp3",
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    original_filename: "Psychology 201 - Cognitive Behavioral Theory.pdf",
    status: "done",
    audio_url: "audio/3.mp3",
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    original_filename: "Organic Chemistry - Reaction Mechanisms.pdf",
    status: "done",
    audio_url: "audio/4.mp3",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    original_filename: "World History - The French Revolution.pdf",
    status: "done",
    audio_url: "audio/5.mp3",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────

function timeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function cleanFilename(filename: string): string {
  return filename.replace(/\.pdf$/i, "");
}

// ─── Skeleton Row ────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <View className="flex-row items-center bg-poddy-surface border border-poddy-border px-4 py-4 mb-2 rounded-xl">
      <View className="w-8 h-8 rounded-lg bg-poddy-border mr-4" />
      <View className="flex-1">
        <View className="h-4 w-3/4 rounded bg-poddy-border mb-2" />
        <View className="h-3 w-1/3 rounded bg-poddy-border" />
      </View>
    </View>
  );
}

// ─── List Row ────────────────────────────────────────────────────────

function ListRow({ item, onPress }: { item: Podcast; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <View className="flex-row items-center bg-poddy-surface border border-poddy-border px-4 py-4 mb-2 rounded-xl">
        {/* Icon */}
        <View className="w-8 h-8 rounded-lg bg-poddy-accent-soft items-center justify-center mr-4">
          <Ionicons name="headset" size={16} color="#7C3AED" />
        </View>

        {/* Text content */}
        <View className="flex-1 mr-4">
          <Text className="text-poddy-text-primary text-[15px] font-medium leading-5 mb-1" numberOfLines={1}>
            {cleanFilename(item.original_filename)}
          </Text>
          <View className="flex-row items-center">
            <Text className="text-poddy-text-secondary text-[13px]">AI Podcast</Text>
            <View className="w-1 h-1 rounded-full bg-poddy-text-muted mx-2" />
            <Text className="text-poddy-text-secondary text-[13px]">
              {timeAgo(item.created_at)}
            </Text>
          </View>
        </View>

        {/* Play Icon */}
        <Ionicons name="play-outline" size={20} color="#888888" />
      </View>
    </TouchableOpacity>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────

function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center px-8 mt-12">
      <View className="w-16 h-16 rounded-2xl bg-poddy-surface border border-poddy-border items-center justify-center mb-6">
        <Ionicons name="document-text-outline" size={28} color="#888888" />
      </View>
      <Text className="text-poddy-text-primary text-[18px] font-medium mb-2">No podcasts yet</Text>
      <Text className="text-poddy-text-secondary text-[14px] text-center leading-5">
        Upload a PDF to instantly generate a two-host AI study podcast.
      </Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────

export default function HomeScreen() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPodcasts = useCallback(async () => {
    try {
      // TODO: Replace with real API call
      // const token = await getToken();
      // const res = await fetch(`${API_BASE}/api/podcasts`, { headers: { Authorization: `Bearer ${token}` } });
      // const data = await res.json();
      // setPodcasts(data.filter((p: Podcast) => p.status === 'done'));
      await new Promise((resolve) => setTimeout(resolve, 800));
      setPodcasts(MOCK_PODCASTS.filter((p) => p.status === "done"));
    } catch (err) {
      console.error("Failed to load podcasts:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPodcasts();
  }, [loadPodcasts]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPodcasts();
  }, [loadPodcasts]);

  const handlePodcastPress = (podcast: Podcast) => {
    router.push({
      pathname: "/player/[id]",
      params: { id: podcast.id, filename: podcast.original_filename },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-poddy-bg" edges={["top"]}>
      {/* ── HEADER ── */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-6">
        <Text className="text-poddy-text-primary text-[22px] font-semibold tracking-tight">Poddy</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.navigate("/(tabs)/upload")}
          className="flex-row items-center bg-poddy-surface border border-poddy-border px-3 py-1.5 rounded-lg"
        >
          <Ionicons name="add" size={16} color="#EEEEEE" />
          <Text className="text-poddy-text-primary text-[13px] font-medium ml-1">Upload PDF</Text>
        </TouchableOpacity>
      </View>

      {/* ── CONTENT ── */}
      <View className="flex-1 px-5">
        <View className="flex-row items-center mb-4">
          <Ionicons name="list" size={14} color="#888888" />
          <Text className="text-poddy-text-secondary text-[13px] font-medium ml-2 uppercase tracking-widest">
            Your Library
          </Text>
        </View>

        {loading ? (
          // ── SKELETON ──
          <View>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </View>
        ) : podcasts.length === 0 ? (
          // ── EMPTY STATE ──
          <EmptyState />
        ) : (
          // ── LIST ──
          <FlatList
            data={podcasts}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#7C3AED"
                colors={["#7C3AED"]}
              />
            }
            renderItem={({ item }) => (
              <ListRow item={item} onPress={() => handlePodcastPress(item)} />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
