import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  RefreshControl,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const API_BASE = "http://YOUR_BACKEND_IP:5000";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── Types ──────────────────────────────────────────────────────────

interface Podcast {
  id: string;
  original_filename: string;
  status: string;
  audio_url: string | null;
  created_at: string;
}

// ─── Mock Data (remove when backend is connected) ───────────────────

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

// ─── Helpers ────────────────────────────────────────────────────────

function timeAgo(dateString: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000
  );
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(dateString).toLocaleDateString();
}

function cleanFilename(filename: string): string {
  return filename.replace(/\.pdf$/i, "");
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 21) return "Good evening";
  return "Burning the midnight oil?";
}

// ─── Skeleton Card ──────────────────────────────────────────────────

function SkeletonCard() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={{ opacity }}
      className="flex-row items-center rounded-2xl bg-poddy-card p-4 mb-3"
    >
      <View className="w-12 h-12 rounded-xl bg-poddy-card-hover" />
      <View className="flex-1 ml-3">
        <View className="h-4 w-3/4 rounded bg-poddy-card-hover mb-2" />
        <View className="h-3 w-1/2 rounded bg-poddy-card-hover" />
      </View>
      <View className="w-10 h-10 rounded-full bg-poddy-card-hover" />
    </Animated.View>
  );
}

// ─── Recent Card (Horizontal Compact) ───────────────────────────────

function RecentCard({
  item,
  onPress,
}: {
  item: Podcast;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View
        style={[
          {
            transform: [{ scale }],
            width: SCREEN_WIDTH * 0.42,
          },
        ]}
        className="rounded-2xl bg-poddy-card mr-3 overflow-hidden"
      >
        {/* Purple accent stripe */}
        <View className="h-1 bg-poddy-accent" />

        <View className="p-3.5">
          {/* Icon */}
          <View
            className="w-9 h-9 rounded-lg items-center justify-center mb-3"
            style={{ backgroundColor: "#1a1025" }}
          >
            <Ionicons name="headset" size={18} color="#7c3aed" />
          </View>

          {/* Filename */}
          <Text
            className="text-white text-sm font-semibold mb-1.5"
            numberOfLines={2}
          >
            {cleanFilename(item.original_filename)}
          </Text>

          {/* Timestamp */}
          <Text className="text-poddy-text-muted text-xs">
            {timeAgo(item.created_at)}
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

// ─── Library Card (Full Width) ──────────────────────────────────────

function LibraryCard({
  item,
  onPress,
}: {
  item: Podcast;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View
        style={{ transform: [{ scale }] }}
        className="flex-row items-center rounded-2xl bg-poddy-card p-4 mb-3"
      >
        {/* Left icon */}
        <View
          className="w-12 h-12 rounded-xl items-center justify-center"
          style={{ backgroundColor: "#1a1025" }}
        >
          <Ionicons name="headset" size={22} color="#7c3aed" />
        </View>

        {/* Center content */}
        <View className="flex-1 ml-3 mr-3">
          <Text
            className="text-white text-[15px] font-semibold leading-5"
            numberOfLines={2}
          >
            {cleanFilename(item.original_filename)}
          </Text>
          <Text className="text-poddy-text-secondary text-xs mt-1">
            AI Podcast • {timeAgo(item.created_at)}
          </Text>
        </View>

        {/* Play button */}
        <View
          className="w-10 h-10 rounded-full items-center justify-center bg-poddy-accent"
        >
          <Ionicons
            name="play"
            size={18}
            color="#ffffff"
            style={{ marginLeft: 2 }}
          />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

// ─── Empty State ────────────────────────────────────────────────────

function EmptyState() {
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scale, opacity]);

  return (
    <Animated.View
      style={{ transform: [{ scale }], opacity }}
      className="flex-1 items-center justify-center px-8 -mt-16"
    >
      {/* Icon container */}
      <View
        className="w-24 h-24 rounded-3xl items-center justify-center mb-6"
        style={{ backgroundColor: "#161616" }}
      >
        <Ionicons name="headset-outline" size={44} color="#333333" />
      </View>

      <Text className="text-white text-xl font-bold mb-2 text-center">
        No podcasts yet
      </Text>
      <Text className="text-poddy-text-muted text-sm text-center leading-5 mb-8">
        Upload your first PDF and let{"\n"}Poddy turn it into a study podcast
      </Text>

      <TouchableOpacity
        className="bg-poddy-accent px-8 py-3.5 rounded-2xl"
        onPress={() => router.navigate("/(tabs)/upload")}
        activeOpacity={0.8}
      >
        <View className="flex-row items-center">
          <Ionicons name="cloud-upload-outline" size={18} color="#ffffff" />
          <Text className="text-white font-semibold text-[15px] ml-2">
            Upload PDF
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── FAB ────────────────────────────────────────────────────────────

function FAB({ onPress }: { onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.88,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={{
        position: "absolute",
        bottom: 24,
        right: 20,
        zIndex: 50,
      }}
    >
      <Animated.View
        style={[
          {
            transform: [{ scale }],
            shadowColor: "#7c3aed",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 12,
            elevation: 8,
          },
        ]}
        className="w-14 h-14 rounded-full bg-poddy-accent items-center justify-center"
      >
        <Ionicons name="add" size={28} color="#ffffff" />
      </Animated.View>
    </TouchableOpacity>
  );
}

// ─── Main Screen ────────────────────────────────────────────────────

export default function HomeScreen() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch podcasts — swap mock data for real API call later
  const loadPodcasts = useCallback(async () => {
    try {
      // TODO: Replace with real API call
      // const token = await getToken();
      // const res = await fetch(`${API_BASE}/api/podcasts`, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // const data = await res.json();
      // setPodcasts(data.filter((p: Podcast) => p.status === 'done'));

      // Mock: simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setPodcasts(MOCK_PODCASTS.filter((p) => p.status === "done"));
    } catch (error) {
      console.error("Failed to load podcasts:", error);
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
      params: {
        id: podcast.id,
        filename: podcast.original_filename,
      },
    });
  };

  // Split data
  const recentPodcasts = podcasts.slice(0, 3);
  const allPodcasts = podcasts;

  // ─── Render ─────────────────────────────────────────────────

  return (
    <SafeAreaView className="flex-1 bg-poddy-bg" edges={["top"]}>
      {/* Loading state */}
      {loading ? (
        <View className="flex-1 px-5 pt-4">
          {/* Header skeleton */}
          <View className="mb-8 mt-2">
            <View className="h-8 w-28 rounded-lg bg-poddy-card mb-2" />
            <View className="h-4 w-44 rounded bg-poddy-card" />
          </View>
          {/* Card skeletons */}
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : podcasts.length === 0 ? (
        /* Empty state */
        <>
          <View className="px-5 pt-4 mt-2">
            <Text className="text-white text-3xl font-bold tracking-tight">
              Poddy
            </Text>
            <Text className="text-poddy-text-muted text-sm mt-1">
              {getGreeting()}
            </Text>
          </View>
          <EmptyState />
        </>
      ) : (
        /* Content state */
        <>
          <FlatList
            data={allPodcasts}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#7c3aed"
                colors={["#7c3aed"]}
              />
            }
            ListHeaderComponent={
              <>
                {/* ── Header ── */}
                <View className="mt-2 mb-6">
                  <Text className="text-white text-3xl font-bold tracking-tight">
                    Poddy
                  </Text>
                  <Text className="text-poddy-text-muted text-sm mt-1">
                    {getGreeting()} — Your study podcasts
                  </Text>
                </View>

                {/* ── Recent Section ── */}
                {recentPodcasts.length > 0 && (
                  <View className="mb-7">
                    <View className="flex-row items-center justify-between mb-3.5">
                      <Text className="text-white text-lg font-semibold">
                        Recent
                      </Text>
                      <Ionicons
                        name="chevron-forward"
                        size={18}
                        color="#6b7280"
                      />
                    </View>

                    <FlatList
                      data={recentPodcasts}
                      keyExtractor={(item) => `recent-${item.id}`}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      renderItem={({ item }) => (
                        <RecentCard
                          item={item}
                          onPress={() => handlePodcastPress(item)}
                        />
                      )}
                    />
                  </View>
                )}

                {/* ── Library Section Header ── */}
                <View className="flex-row items-center justify-between mb-3.5">
                  <Text className="text-white text-lg font-semibold">
                    Your Library
                  </Text>
                  <Text className="text-poddy-text-muted text-xs">
                    {allPodcasts.length}{" "}
                    {allPodcasts.length === 1 ? "podcast" : "podcasts"}
                  </Text>
                </View>
              </>
            }
            renderItem={({ item }) => (
              <LibraryCard
                item={item}
                onPress={() => handlePodcastPress(item)}
              />
            )}
          />

          {/* FAB */}
          <FAB onPress={() => router.navigate("/(tabs)/upload")} />
        </>
      )}
    </SafeAreaView>
  );
}
