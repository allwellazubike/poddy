import React, { useState, useEffect, useRef, useCallback } from "react";
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

// ─── Types ──────────────────────────────────────────────────────────

interface Podcast {
  id: string;
  original_filename: string;
  status: string;
  audio_url: string | null;
  created_at: string;
}

interface PublicPodcast {
  id: string;
  title: string;
  creator: string;
  niche: string;
  duration: string;
  plays: number;
  created_at: string;
}

// ─── Mock Data — Your Podcasts ───────────────────────────────────────

const MOCK_MY_PODCASTS: Podcast[] = [
  {
    id: "1",
    original_filename: "Biology Chapter 5 - Cell Division.pdf",
    status: "done",
    audio_url: "audio/1.mp3",
    created_at: new Date(Date.now() - 1 * 3600000).toISOString(),
  },
  {
    id: "2",
    original_filename: "Data Structures and Algorithms.pdf",
    status: "done",
    audio_url: "audio/2.mp3",
    created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
  {
    id: "3",
    original_filename: "Cognitive Behavioral Theory.pdf",
    status: "done",
    audio_url: "audio/3.mp3",
    created_at: new Date(Date.now() - 8 * 3600000).toISOString(),
  },
];

// ─── Mock Data — Discover (other users' public podcasts) ─────────────

const MOCK_DISCOVER: PublicPodcast[] = [
  {
    id: "d1",
    title: "Neural Networks Explained Simply",
    creator: "Sarah K.",
    niche: "Computer Science",
    duration: "8 min",
    plays: 342,
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "d2",
    title: "The Krebs Cycle - A Deep Dive",
    creator: "James O.",
    niche: "Biology",
    duration: "6 min",
    plays: 128,
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: "d3",
    title: "Constitutional Law Fundamentals",
    creator: "Ade M.",
    niche: "Law",
    duration: "11 min",
    plays: 89,
    created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
  {
    id: "d4",
    title: "Freudian Psychology vs Modern CBT",
    creator: "Lena R.",
    niche: "Psychology",
    duration: "9 min",
    plays: 215,
    created_at: new Date(Date.now() - 18 * 3600000).toISOString(),
  },
  {
    id: "d5",
    title: "Introduction to Organic Synthesis",
    creator: "Tobi A.",
    niche: "Chemistry",
    duration: "7 min",
    plays: 67,
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: "d6",
    title: "Calculus II - Integration by Parts",
    creator: "Maria C.",
    niche: "Mathematics",
    duration: "5 min",
    plays: 431,
    created_at: new Date(Date.now() - 36 * 3600000).toISOString(),
  },
];

// ─── Niche colors ────────────────────────────────────────────────────

const NICHE_COLORS: Record<string, string> = {
  "Computer Science": "#0D9488",
  Biology: "#059669",
  Law: "#D97706",
  Psychology: "#E11D48",
  Chemistry: "#2563EB",
  Mathematics: "#DC2626",
};

function getNicheColor(niche: string): string {
  return NICHE_COLORS[niche] || "#6B7280";
}

// ─── Helpers ─────────────────────────────────────────────────────────

function timeAgo(d: string): string {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return "Just now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 604800) return `${Math.floor(s / 86400)}d`;
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function cleanFilename(f: string): string {
  return f.replace(/\.pdf$/i, "");
}

function formatPlays(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

// ─── Skeleton ────────────────────────────────────────────────────────

function SkeletonPulse({ w, h, r = 8, mb = 0 }: { w: number | string; h: number; r?: number; mb?: number }) {
  const op = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.timing(op, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(op, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    a.start();
    return () => a.stop();
  }, [op]);
  return <Animated.View style={{ opacity: op, width: w as any, height: h, borderRadius: r, backgroundColor: "#E4E4E9", marginBottom: mb }} />;
}

// ─── Recent Card (Horizontal) ────────────────────────────────────────

const RECENT_W = SCREEN_WIDTH * 0.38;

function RecentCard({ item, onPress }: { item: Podcast; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <View
        style={{ width: RECENT_W }}
        className="bg-poddy-surface border border-poddy-border rounded-2xl mr-3 overflow-hidden"
      >
        {/* Thumbnail area */}
        <View className="w-full aspect-square bg-poddy-accent-soft items-center justify-center">
          <Ionicons name="headset" size={28} color="#0D9488" />
        </View>
        {/* Info */}
        <View className="p-3">
          <Text className="text-poddy-text-primary text-[13px] font-semibold leading-4 mb-1" numberOfLines={2}>
            {cleanFilename(item.original_filename)}
          </Text>
          <Text className="text-poddy-text-muted text-[11px]">{timeAgo(item.created_at)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Discover Row ────────────────────────────────────────────────────

function DiscoverRow({ item, onPress }: { item: PublicPodcast; onPress: () => void }) {
  const nicheColor = getNicheColor(item.niche);

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <View className="flex-row items-center bg-poddy-surface border border-poddy-border rounded-xl px-4 py-3.5 mb-2">
        {/* Creator avatar */}
        <View
          style={{ backgroundColor: nicheColor + "18", borderWidth: 1, borderColor: nicheColor + "30" }}
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
        >
          <Text style={{ color: nicheColor, fontSize: 14, fontWeight: "700" }}>
            {item.creator[0]}
          </Text>
        </View>

        {/* Content */}
        <View className="flex-1 mr-3">
          <Text className="text-poddy-text-primary text-[14px] font-semibold leading-5 mb-1" numberOfLines={1}>
            {item.title}
          </Text>
          <View className="flex-row items-center">
            <Text className="text-poddy-text-secondary text-[12px]">{item.creator}</Text>
            <View className="w-1 h-1 rounded-full bg-poddy-text-muted mx-1.5" />
            <View style={{ backgroundColor: nicheColor + "14", borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 }}>
              <Text style={{ color: nicheColor, fontSize: 10, fontWeight: "600" }}>{item.niche}</Text>
            </View>
            <View className="w-1 h-1 rounded-full bg-poddy-text-muted mx-1.5" />
            <Text className="text-poddy-text-muted text-[11px]">{item.duration}</Text>
          </View>
        </View>

        {/* Stats + Play */}
        <View className="items-end">
          <Ionicons name="play-circle" size={28} color="#0D9488" />
          <Text className="text-poddy-text-muted text-[10px] mt-1">
            {formatPlays(item.plays)} plays
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Section Header ──────────────────────────────────────────────────

function SectionHeader({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
  return (
    <View className="flex-row items-center justify-between mb-3">
      <Text className="text-poddy-text-primary text-[18px] font-bold tracking-tight">{title}</Text>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll} activeOpacity={0.6}>
          <Text className="text-poddy-accent text-[13px] font-medium">See all</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────

export default function HomeScreen() {
  const [myPodcasts, setMyPodcasts] = useState<Podcast[]>([]);
  const [discover, setDiscover] = useState<PublicPodcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      // TODO: Replace with real API calls
      await new Promise((r) => setTimeout(r, 800));
      setMyPodcasts(MOCK_MY_PODCASTS.filter((p) => p.status === "done"));
      setDiscover(MOCK_DISCOVER);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const handleMyPodcastPress = (p: Podcast) => {
    router.push({
      //@ts-ignore
      pathname: "/player/[id]",
      params: { id: p.id, filename: p.original_filename },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-poddy-bg" edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0D9488" colors={["#0D9488"]} />
        }
      >
        {/* ── HEADER ── */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-5">
          <Text className="text-poddy-text-primary text-[24px] font-bold tracking-tight">Poddy</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {/* TODO: navigate to profile */}}
            className="w-9 h-9 rounded-full bg-poddy-surface border border-poddy-border items-center justify-center"
          >
            <Ionicons name="person" size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {loading ? (
          // ── SKELETON ──
          <View className="px-5">
            {/* Recent skeleton */}
            <SkeletonPulse w={100} h={16} mb={12} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
              {[0, 1, 2].map((i) => (
                <View key={i} style={{ width: RECENT_W, marginRight: 12 }}>
                  <SkeletonPulse w={RECENT_W} h={RECENT_W} r={16} mb={0} />
                  <View className="p-3">
                    <SkeletonPulse w="80%" h={12} mb={6} />
                    <SkeletonPulse w="40%" h={10} />
                  </View>
                </View>
              ))}
            </ScrollView>
            {/* Discover skeleton */}
            <SkeletonPulse w={120} h={16} mb={12} />
            {[0, 1, 2, 3].map((i) => (
              <View key={i} className="flex-row items-center mb-3">
                <SkeletonPulse w={40} h={40} r={20} mb={0} />
                <View className="flex-1 ml-3">
                  <SkeletonPulse w="75%" h={14} mb={6} />
                  <SkeletonPulse w="50%" h={10} />
                </View>
              </View>
            ))}
          </View>
        ) : (
          <>
            {/* ── YOUR RECENT ── */}
            {myPodcasts.length > 0 && (
              <View className="mb-7">
                <View className="px-5">
                  <SectionHeader
                    title="Your Recent"
                    onSeeAll={() => router.navigate("/(tabs)/library")}
                  />
                </View>
                <FlatList
                  data={myPodcasts}
                  keyExtractor={(item) => `recent-${item.id}`}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20 }}
                  renderItem={({ item }) => (
                    <RecentCard item={item} onPress={() => handleMyPodcastPress(item)} />
                  )}
                />
              </View>
            )}

            {/* ── DISCOVER ── */}
            <View className="px-5">
              <SectionHeader title="Discover" />

              {discover.map((item) => (
                <DiscoverRow
                  key={item.id}
                  item={item}
                  onPress={() => {
                    /* TODO: navigate to public podcast player */
                  }}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
