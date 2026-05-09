import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  RefreshControl,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const API_BASE = "http://YOUR_BACKEND_IP:5000";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - 40 - CARD_GAP) / 2;

// ─── Types ──────────────────────────────────────────────────────────

interface Podcast {
  id: string;
  original_filename: string;
  status: string;
  audio_url: string | null;
  created_at: string;
}

type FilterTab = "all" | "recent" | "oldest";

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
    created_at: new Date(
      Date.now() - 3 * 24 * 60 * 60 * 1000
    ).toISOString(),
  },
  {
    id: "6",
    original_filename: "Mathematics - Calculus Integration Techniques.pdf",
    status: "done",
    audio_url: "audio/6.mp3",
    created_at: new Date(
      Date.now() - 5 * 24 * 60 * 60 * 1000
    ).toISOString(),
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────

function timeAgo(dateString: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000
  );
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function cleanFilename(filename: string): string {
  return filename.replace(/\.pdf$/i, "");
}

// A short label (1-2 words) derived from the filename for the artwork tile
function getShortLabel(filename: string): string {
  const clean = cleanFilename(filename);
  const words = clean.split(/[\s\-_]+/).filter(Boolean);
  // Skip leading noise words
  const noise = new Set(["chapter", "the", "a", "an", "of", "and", "&"]);
  const meaningful = words.filter((w) => !noise.has(w.toLowerCase()));
  return meaningful.slice(0, 2).join(" ").toUpperCase() || clean.slice(0, 6).toUpperCase();
}

// ─── Skeleton ────────────────────────────────────────────────────────

function SkeletonCard({ wide }: { wide?: boolean }) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  if (wide) {
    return (
      <Animated.View
        style={{ opacity, marginBottom: 12 }}
        className="rounded-2xl overflow-hidden"
      >
        <View
          style={{ height: 160, backgroundColor: "#e8e8e8" }}
          className="w-full"
        />
        <View className="p-4 border border-paper-mid rounded-b-2xl">
          <View
            style={{ height: 12, width: "60%", backgroundColor: "#e8e8e8" }}
            className="rounded mb-2"
          />
          <View
            style={{ height: 10, width: "40%", backgroundColor: "#e8e8e8" }}
            className="rounded"
          />
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={{ opacity, width: CARD_WIDTH, marginBottom: 12 }}
      className="rounded-2xl overflow-hidden border border-paper-mid"
    >
      <View style={{ height: 100, backgroundColor: "#e8e8e8" }} />
      <View style={{ backgroundColor: "#f5f5f5" }} className="p-3">
        <View
          style={{ height: 10, width: "80%", backgroundColor: "#e8e8e8" }}
          className="rounded mb-2"
        />
        <View
          style={{ height: 8, width: "50%", backgroundColor: "#e8e8e8" }}
          className="rounded"
        />
      </View>
    </Animated.View>
  );
}

// ─── Grid Card (small, 2-column) ─────────────────────────────────────

function GridCard({ item, onPress }: { item: Podcast; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();

  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }).start();

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={pressIn}
      onPressOut={pressOut}
      onPress={onPress}
    >
      <Animated.View
        style={{
          width: CARD_WIDTH,
          transform: [{ scale }],
        }}
        className="rounded-2xl overflow-hidden mb-3"
      >
        {/* Artwork tile */}
        <View
          style={{
            height: CARD_WIDTH * 0.72,
            backgroundColor: "#0a0a0a",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Abstract offset squares decoration */}
          <View
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              width: 28,
              height: 28,
              borderWidth: 1.5,
              borderColor: "rgba(255,255,255,0.15)",
              borderRadius: 6,
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
              width: 18,
              height: 18,
              borderWidth: 1.5,
              borderColor: "rgba(255,255,255,0.1)",
              borderRadius: 4,
            }}
          />
          <Text
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: 10,
              fontWeight: "800",
              letterSpacing: 1.5,
              textAlign: "center",
              paddingHorizontal: 8,
            }}
            numberOfLines={2}
          >
            {getShortLabel(item.original_filename)}
          </Text>
        </View>

        {/* Card body */}
        <View
          style={{ borderWidth: 1, borderTopWidth: 0, borderColor: "#e8e8e8" }}
          className="p-3 rounded-b-2xl bg-paper"
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: "#0a0a0a",
              lineHeight: 16,
            }}
            numberOfLines={2}
          >
            {cleanFilename(item.original_filename)}
          </Text>
          <View className="flex-row items-center justify-between mt-2">
            <Text
              style={{ fontSize: 10, color: "#8a8a8a", fontWeight: "500" }}
            >
              {timeAgo(item.created_at)}
            </Text>
            {/* Mini play button */}
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                backgroundColor: "#0a0a0a",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="play"
                size={9}
                color="#fff"
                style={{ marginLeft: 1 }}
              />
            </View>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

// ─── Featured Card (full-width, latest podcast) ────────────────────

function FeaturedCard({
  item,
  onPress,
}: {
  item: Podcast;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.98, useNativeDriver: true }).start();
  const pressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={pressIn}
      onPressOut={pressOut}
      onPress={onPress}
    >
      <Animated.View
        style={{ transform: [{ scale }] }}
        className="rounded-2xl overflow-hidden mb-6"
      >
        {/* Artwork */}
        <View
          style={{
            height: 180,
            backgroundColor: "#0a0a0a",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 20,
            flexDirection: "row",
          }}
        >
          {/* Text content left */}
          <View style={{ flex: 1, paddingRight: 16 }}>
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.12)",
                alignSelf: "flex-start",
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 20,
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: 9,
                  fontWeight: "700",
                  letterSpacing: 1.2,
                }}
              >
                LATEST
              </Text>
            </View>
            <Text
              style={{
                color: "#ffffff",
                fontSize: 16,
                fontWeight: "800",
                lineHeight: 22,
              }}
              numberOfLines={3}
            >
              {cleanFilename(item.original_filename)}
            </Text>
            <Text
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: 11,
                marginTop: 8,
                fontWeight: "500",
              }}
            >
              {timeAgo(item.created_at)} • AI Podcast
            </Text>
          </View>

          {/* Large play button right */}
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              borderWidth: 1.5,
              borderColor: "rgba(255,255,255,0.3)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="play"
              size={22}
              color="#ffffff"
              style={{ marginLeft: 2 }}
            />
          </View>
        </View>

        {/* Bottom strip */}
        <View
          style={{
            backgroundColor: "#f5f5f5",
            paddingHorizontal: 16,
            paddingVertical: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name="headset-outline" size={13} color="#8a8a8a" />
          <Text
            style={{
              color: "#8a8a8a",
              fontSize: 11,
              marginLeft: 5,
              fontWeight: "600",
            }}
          >
            Alex & Jamie · AI Study Podcast
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

// ─── Filter Tabs ──────────────────────────────────────────────────────

function FilterTabs({
  active,
  onChange,
}: {
  active: FilterTab;
  onChange: (t: FilterTab) => void;
}) {
  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "recent", label: "Recent" },
    { key: "oldest", label: "Oldest" },
  ];

  return (
    <View className="flex-row mb-6">
      {tabs.map((t) => (
        <TouchableOpacity
          key={t.key}
          onPress={() => onChange(t.key)}
          activeOpacity={0.7}
          style={{ marginRight: 8 }}
        >
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 7,
              borderRadius: 20,
              backgroundColor: active === t.key ? "#0a0a0a" : "transparent",
              borderWidth: 1,
              borderColor: active === t.key ? "#0a0a0a" : "#d0d0d0",
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: active === t.key ? "#ffffff" : "#8a8a8a",
                letterSpacing: 0.2,
              }}
            >
              {t.label}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────

function EmptyState() {
  const translateY = useRef(new Animated.Value(24)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateY, opacity]);

  return (
    <Animated.View
      style={{ transform: [{ translateY }], opacity }}
      className="flex-1 items-center justify-center px-8"
    >
      {/* Big typographic "0" */}
      <Text
        style={{
          fontSize: 120,
          fontWeight: "900",
          color: "#f0f0f0",
          lineHeight: 130,
          letterSpacing: -4,
        }}
      >
        0
      </Text>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "800",
          color: "#0a0a0a",
          marginTop: 8,
          marginBottom: 8,
          letterSpacing: -0.5,
        }}
      >
        No podcasts yet.
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: "#8a8a8a",
          textAlign: "center",
          lineHeight: 20,
          marginBottom: 32,
        }}
      >
        Upload a PDF and Poddy turns it{"\n"}into a conversational podcast.
      </Text>

      <TouchableOpacity
        onPress={() => router.navigate("/(tabs)/upload")}
        activeOpacity={0.85}
      >
        <View
          style={{
            backgroundColor: "#0a0a0a",
            paddingHorizontal: 28,
            paddingVertical: 14,
            borderRadius: 14,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name="arrow-up-circle-outline" size={18} color="#fff" />
          <Text
            style={{
              color: "#fff",
              fontWeight: "700",
              fontSize: 15,
              marginLeft: 8,
            }}
          >
            Upload PDF
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── FAB ─────────────────────────────────────────────────────────────

function FAB({ onPress }: { onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.88, useNativeDriver: true }).start();
  const pressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 200,
      useNativeDriver: true,
    }).start();

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={pressIn}
      onPressOut={pressOut}
      onPress={onPress}
      style={{ position: "absolute", bottom: 24, right: 20, zIndex: 50 }}
    >
      <Animated.View
        style={[
          {
            transform: [{ scale }],
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.18,
            shadowRadius: 16,
            elevation: 10,
          },
        ]}
      >
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: "#0a0a0a",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="add" size={26} color="#ffffff" />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────

export default function HomeScreen() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterTab>("all");

  const loadPodcasts = useCallback(async () => {
    try {
      // TODO: Replace with real API call
      // const token = await getToken();
      // const res = await fetch(`${API_BASE}/api/podcasts`, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // const data = await res.json();
      // setPodcasts(data.filter((p: Podcast) => p.status === 'done'));
      await new Promise((resolve) => setTimeout(resolve, 1000));
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

  // Sorted list based on filter
  const filteredPodcasts = useMemo(() => {
    const sorted = [...podcasts];
    if (filter === "recent") {
      sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (filter === "oldest") {
      sorted.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    }
    return sorted;
  }, [podcasts, filter]);

  // Featured = most recent
  const featured = filteredPodcasts[0];
  // Grid = rest
  const gridItems = filteredPodcasts.slice(1);

  // Build pairs for the 2-col grid
  const gridRows: Podcast[][] = [];
  for (let i = 0; i < gridItems.length; i += 2) {
    gridRows.push(gridItems.slice(i, i + 2));
  }

  // ─── Render ──────────────────────────────────────────────────────

  return (
    <SafeAreaView className="flex-1 bg-paper" edges={["top"]}>
      {loading ? (
        // ── SKELETON ──
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header skeleton */}
          <View className="mb-6">
            <View
              style={{ height: 42, width: 160, backgroundColor: "#e8e8e8" }}
              className="rounded-lg mb-2"
            />
            <View
              style={{ height: 14, width: 220, backgroundColor: "#f0f0f0" }}
              className="rounded"
            />
          </View>
          {/* Divider */}
          <View style={{ height: 1, backgroundColor: "#e8e8e8" }} className="mb-5" />
          {/* Filter skeleton */}
          <View className="flex-row mb-6">
            {[60, 70, 65].map((w, i) => (
              <View
                key={i}
                style={{
                  width: w,
                  height: 34,
                  backgroundColor: "#e8e8e8",
                  borderRadius: 20,
                  marginRight: 8,
                }}
              />
            ))}
          </View>
          {/* Featured skeleton */}
          <SkeletonCard wide />
          {/* Grid skeleton */}
          <View className="flex-row justify-between">
            <SkeletonCard />
            <SkeletonCard />
          </View>
        </ScrollView>
      ) : podcasts.length === 0 ? (
        // ── EMPTY STATE ──
        <>
          <View className="px-5 pt-4">
            <Text
              style={{
                fontSize: 38,
                fontWeight: "900",
                color: "#0a0a0a",
                letterSpacing: -1.5,
              }}
            >
              PODDY
            </Text>
            <Text style={{ fontSize: 13, color: "#8a8a8a", marginTop: 2 }}>
              Your study podcasts
            </Text>
          </View>
          <EmptyState />
        </>
      ) : (
        // ── CONTENT ──
        <>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 100,
            }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#0a0a0a"
                colors={["#0a0a0a"]}
              />
            }
          >
            {/* ── MASTHEAD HEADER ── */}
            <View className="mb-5">
              <View className="flex-row items-start justify-between">
                <View>
                  <Text
                    style={{
                      fontSize: 42,
                      fontWeight: "900",
                      color: "#0a0a0a",
                      letterSpacing: -2,
                      lineHeight: 44,
                    }}
                  >
                    PODDY
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#8a8a8a",
                      marginTop: 3,
                      fontWeight: "500",
                      letterSpacing: 0.2,
                    }}
                  >
                    {podcasts.length} podcast
                    {podcasts.length !== 1 ? "s" : ""} in your library
                  </Text>
                </View>

                {/* Count badge */}
                <View
                  style={{
                    marginTop: 4,
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: "#0a0a0a",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 16,
                      fontWeight: "900",
                    }}
                  >
                    {podcasts.length}
                  </Text>
                </View>
              </View>
            </View>

            {/* ── RULE ── */}
            <View
              style={{ height: 1, backgroundColor: "#0a0a0a" }}
              className="mb-5"
            />

            {/* ── FILTER TABS ── */}
            <FilterTabs active={filter} onChange={setFilter} />

            {/* ── FEATURED CARD ── */}
            {featured && (
              <FeaturedCard
                item={featured}
                onPress={() => handlePodcastPress(featured)}
              />
            )}

            {/* ── SECTION LABEL ── */}
            {gridItems.length > 0 && (
              <View className="flex-row items-center justify-between mb-4">
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "700",
                    color: "#8a8a8a",
                    letterSpacing: 1.5,
                  }}
                >
                  ALL EPISODES
                </Text>
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: "#e8e8e8",
                    marginLeft: 12,
                  }}
                />
              </View>
            )}

            {/* ── 2-COL GRID ── */}
            {gridRows.map((row, rowIdx) => (
              <View
                key={rowIdx}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {row.map((item) => (
                  <GridCard
                    key={item.id}
                    item={item}
                    onPress={() => handlePodcastPress(item)}
                  />
                ))}
                {/* Spacer if odd row */}
                {row.length === 1 && <View style={{ width: CARD_WIDTH }} />}
              </View>
            ))}
          </ScrollView>

          {/* ── FAB ── */}
          <FAB onPress={() => router.navigate("/(tabs)/upload")} />
        </>
      )}
    </SafeAreaView>
  );
}
