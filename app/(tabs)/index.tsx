import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  View, Text, TouchableOpacity, Animated, ScrollView,
  RefreshControl, Dimensions, FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const API_BASE = "http://YOUR_BACKEND_IP:5000";
const { width: SW } = Dimensions.get("window");

// ── Palette ─────────────────────────────────────────────────────────
const C = {
  base: "#0D0C0A",
  surface: "#1C1A16",
  surface2: "#252320",
  rim: "#2E2C28",
  gold: "#F4A535",
  goldDim: "#1E1A08",
  cream: "#F2EDE6",
  creamDim: "#9A9288",
  creamFaint: "#6A6258",
};

// ── Types ────────────────────────────────────────────────────────────
interface Podcast {
  id: string;
  original_filename: string;
  status: string;
  audio_url: string | null;
  created_at: string;
}

// ── Mock Data ────────────────────────────────────────────────────────
const MOCK: Podcast[] = [
  { id: "1", original_filename: "Biology Chapter 5 - Cell Division and Mitosis.pdf", status: "done", audio_url: "audio/1.mp3", created_at: new Date(Date.now() - 1 * 3600000).toISOString() },
  { id: "2", original_filename: "Computer Science - Data Structures and Algorithms.pdf", status: "done", audio_url: "audio/2.mp3", created_at: new Date(Date.now() - 3 * 3600000).toISOString() },
  { id: "3", original_filename: "Psychology 201 - Cognitive Behavioral Theory.pdf", status: "done", audio_url: "audio/3.mp3", created_at: new Date(Date.now() - 8 * 3600000).toISOString() },
  { id: "4", original_filename: "Organic Chemistry - Reaction Mechanisms.pdf", status: "done", audio_url: "audio/4.mp3", created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: "5", original_filename: "World History - The French Revolution.pdf", status: "done", audio_url: "audio/5.mp3", created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: "6", original_filename: "Mathematics - Calculus Integration Techniques.pdf", status: "done", audio_url: "audio/6.mp3", created_at: new Date(Date.now() - 5 * 86400000).toISOString() },
];

// ── Helpers ──────────────────────────────────────────────────────────
function timeAgo(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return "Just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function clean(name: string) { return name.replace(/\.pdf$/i, ""); }

function initials(name: string) {
  const words = clean(name).split(/[\s\-_]+/).filter(Boolean);
  return words.slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Burning the midnight oil";
}

// ── Skeleton ─────────────────────────────────────────────────────────
function Shimmer({ w, h, radius = 8 }: { w: number | string; h: number; radius?: number }) {
  const op = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    const a = Animated.loop(Animated.sequence([
      Animated.timing(op, { toValue: 0.7, duration: 800, useNativeDriver: true }),
      Animated.timing(op, { toValue: 0.3, duration: 800, useNativeDriver: true }),
    ]));
    a.start(); return () => a.stop();
  }, [op]);
  return (
    <Animated.View style={{ opacity: op, width: w as any, height: h, borderRadius: radius, backgroundColor: C.surface2 }} />
  );
}

// ── Artwork tile shared across card types ─────────────────────────────
function Artwork({ name, size }: { name: string; size: number }) {
  const label = initials(name);
  return (
    <View style={{
      width: size, height: size, borderRadius: 14,
      backgroundColor: C.goldDim,
      alignItems: "center", justifyContent: "center",
      borderWidth: 1, borderColor: "rgba(244,165,53,0.18)",
    }}>
      {/* subtle grid lines */}
      <View style={{ position: "absolute", top: 0, bottom: 0, left: size / 2 - 0.5, width: 1, backgroundColor: "rgba(244,165,53,0.08)" }} />
      <View style={{ position: "absolute", left: 0, right: 0, top: size / 2 - 0.5, height: 1, backgroundColor: "rgba(244,165,53,0.08)" }} />
      <Text style={{ fontSize: size * 0.28, fontWeight: "800", color: C.gold, letterSpacing: 1 }}>
        {label}
      </Text>
    </View>
  );
}

// ── Hero Card (horizontal scroll, big) ────────────────────────────────
const HERO_W = SW - 80;
function HeroCard({ item, onPress }: { item: Podcast; onPress(): void }) {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <TouchableOpacity activeOpacity={1}
      onPressIn={() => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }).start()}
      onPress={onPress}
    >
      <Animated.View style={{
        transform: [{ scale }], width: HERO_W, marginRight: 14,
        backgroundColor: C.surface, borderRadius: 20,
        borderWidth: 1, borderColor: C.rim, overflow: "hidden",
      }}>
        {/* Artwork top */}
        <View style={{ padding: 16, paddingBottom: 12 }}>
          <Artwork name={item.original_filename} size={HERO_W - 32} />
        </View>
        {/* Info bottom */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: C.cream, lineHeight: 19 }} numberOfLines={2}>
            {clean(item.original_filename)}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.gold, marginRight: 6 }} />
              <Text style={{ fontSize: 11, color: C.creamDim, fontWeight: "500" }}>{timeAgo(item.created_at)}</Text>
            </View>
            <View style={{
              width: 34, height: 34, borderRadius: 17,
              backgroundColor: C.gold, alignItems: "center", justifyContent: "center",
            }}>
              <Ionicons name="play" size={14} color={C.base} style={{ marginLeft: 2 }} />
            </View>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

// ── List Row Card ─────────────────────────────────────────────────────
function RowCard({ item, index, onPress }: { item: Podcast; index: number; onPress(): void }) {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <TouchableOpacity activeOpacity={1}
      onPressIn={() => Animated.spring(scale, { toValue: 0.985, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }).start()}
      onPress={onPress}
    >
      <Animated.View style={{
        transform: [{ scale }],
        flexDirection: "row", alignItems: "center",
        backgroundColor: C.surface, borderRadius: 16,
        borderWidth: 1, borderColor: C.rim,
        padding: 12, marginBottom: 10,
      }}>
        {/* Index number */}
        <Text style={{ width: 28, fontSize: 12, fontWeight: "700", color: C.creamFaint, textAlign: "center" }}>
          {String(index + 1).padStart(2, "0")}
        </Text>

        {/* Artwork */}
        <Artwork name={item.original_filename} size={48} />

        {/* Text */}
        <View style={{ flex: 1, marginLeft: 12, marginRight: 10 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: C.cream, lineHeight: 19 }} numberOfLines={2}>
            {clean(item.original_filename)}
          </Text>
          <Text style={{ fontSize: 11, color: C.creamFaint, marginTop: 3, fontWeight: "500" }}>
            {timeAgo(item.created_at)} · AI Podcast
          </Text>
        </View>

        {/* Play */}
        <View style={{
          width: 32, height: 32, borderRadius: 16,
          borderWidth: 1.5, borderColor: C.gold,
          alignItems: "center", justifyContent: "center",
        }}>
          <Ionicons name="play" size={12} color={C.gold} style={{ marginLeft: 1 }} />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

// ── Empty State ───────────────────────────────────────────────────────
function EmptyState() {
  const op = useRef(new Animated.Value(0)).current;
  const ty = useRef(new Animated.Value(20)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(op, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(ty, { toValue: 0, friction: 7, useNativeDriver: true }),
    ]).start();
  }, []);
  return (
    <Animated.View style={{ flex: 1, alignItems: "center", justifyContent: "center", opacity: op, transform: [{ translateY: ty }], paddingHorizontal: 40 }}>
      <View style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: C.goldDim, alignItems: "center", justifyContent: "center", marginBottom: 20, borderWidth: 1, borderColor: "rgba(244,165,53,0.2)" }}>
        <Ionicons name="headset-outline" size={36} color={C.gold} />
      </View>
      <Text style={{ fontSize: 22, fontWeight: "800", color: C.cream, letterSpacing: -0.5, marginBottom: 8, textAlign: "center" }}>
        No podcasts yet
      </Text>
      <Text style={{ fontSize: 14, color: C.creamFaint, textAlign: "center", lineHeight: 21, marginBottom: 32 }}>
        Upload any PDF and Poddy turns it into a two-host conversational podcast
      </Text>
      <TouchableOpacity onPress={() => router.navigate("/(tabs)/upload")} activeOpacity={0.8}>
        <View style={{ backgroundColor: C.gold, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 14, flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="cloud-upload-outline" size={18} color={C.base} />
          <Text style={{ color: C.base, fontWeight: "800", fontSize: 15, marginLeft: 8 }}>Upload PDF</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── FAB ───────────────────────────────────────────────────────────────
function FAB({ onPress }: { onPress(): void }) {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <TouchableOpacity activeOpacity={1}
      onPressIn={() => Animated.spring(scale, { toValue: 0.88, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, friction: 4, tension: 200, useNativeDriver: true }).start()}
      onPress={onPress}
      style={{ position: "absolute", bottom: 24, right: 20, zIndex: 50 }}
    >
      <Animated.View style={{
        transform: [{ scale }],
        width: 56, height: 56, borderRadius: 28,
        backgroundColor: C.gold,
        alignItems: "center", justifyContent: "center",
        shadowColor: C.gold, shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4, shadowRadius: 14, elevation: 10,
      }}>
        <Ionicons name="add" size={28} color={C.base} />
      </Animated.View>
    </TouchableOpacity>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────
export default function HomeScreen() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPodcasts = useCallback(async () => {
    try {
      // TODO: swap mock for real API
      // const token = await getToken();
      // const res = await fetch(`${API_BASE}/api/podcasts`, { headers: { Authorization: `Bearer ${token}` } });
      // const data = await res.json();
      // setPodcasts(data.filter((p: Podcast) => p.status === "done"));
      await new Promise((r) => setTimeout(r, 1000));
      setPodcasts(MOCK.filter((p) => p.status === "done"));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadPodcasts(); }, [loadPodcasts]);
  const onRefresh = useCallback(() => { setRefreshing(true); loadPodcasts(); }, [loadPodcasts]);
  const goTo = (p: Podcast) => router.push({ pathname: "/player/[id]", params: { id: p.id, filename: p.original_filename } });

  const recent = useMemo(() => [...podcasts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 4), [podcasts]);
  const all = useMemo(() => [...podcasts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()), [podcasts]);

  // ── Render ────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.base }} edges={["top"]}>

      {/* ── LOADING ── */}
      {loading && (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <Shimmer w={120} h={14} radius={6} />
          <View style={{ marginTop: 6, marginBottom: 28 }}><Shimmer w={180} h={32} radius={8} /></View>
          {/* Hero skeleton */}
          <View style={{ marginBottom: 6 }}><Shimmer w="100%" h={14} radius={6} /></View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 28 }}>
            {[0, 1].map((i) => (
              <View key={i} style={{ width: HERO_W, marginRight: 14, borderRadius: 20, overflow: "hidden" }}>
                <Shimmer w={HERO_W} h={HERO_W + 80} radius={20} />
              </View>
            ))}
          </ScrollView>
          {/* Row skeletons */}
          {[0, 1, 2].map((i) => (
            <View key={i} style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, backgroundColor: C.surface, borderRadius: 16, padding: 12 }}>
              <Shimmer w={28} h={12} radius={4} />
              <View style={{ marginLeft: 8 }}><Shimmer w={48} h={48} radius={14} /></View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Shimmer w="80%" h={13} radius={5} />
                <View style={{ marginTop: 6 }}><Shimmer w="50%" h={10} radius={4} /></View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* ── EMPTY ── */}
      {!loading && podcasts.length === 0 && (
        <>
          <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
            <Text style={{ fontSize: 12, fontWeight: "600", color: C.creamFaint, letterSpacing: 1.5, textTransform: "uppercase" }}>
              {greeting()}
            </Text>
            <Text style={{ fontSize: 34, fontWeight: "900", color: C.cream, letterSpacing: -1, marginTop: 4 }}>
              Library
            </Text>
          </View>
          <EmptyState />
        </>
      )}

      {/* ── CONTENT ── */}
      {!loading && podcasts.length > 0 && (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.gold} colors={[C.gold]} />}
          >
            {/* ── HEADER ── */}
            <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 }}>
              <Text style={{ fontSize: 12, fontWeight: "600", color: C.creamFaint, letterSpacing: 1.5, textTransform: "uppercase" }}>
                {greeting()}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginTop: 4 }}>
                <Text style={{ fontSize: 38, fontWeight: "900", color: C.cream, letterSpacing: -1.5, lineHeight: 42 }}>
                  Library
                </Text>
                <View style={{
                  backgroundColor: C.goldDim, borderRadius: 12, borderWidth: 1,
                  borderColor: "rgba(244,165,53,0.25)", paddingHorizontal: 12,
                  paddingVertical: 6, flexDirection: "row", alignItems: "center", marginBottom: 4,
                }}>
                  <Ionicons name="musical-notes" size={12} color={C.gold} />
                  <Text style={{ fontSize: 13, fontWeight: "700", color: C.gold, marginLeft: 5 }}>
                    {podcasts.length}
                  </Text>
                </View>
              </View>
            </View>

            {/* ── DIVIDER ── */}
            <View style={{ height: 1, backgroundColor: C.rim, marginHorizontal: 20, marginBottom: 24 }} />

            {/* ── RECENT HORIZONTAL CAROUSEL ── */}
            <View style={{ marginBottom: 30 }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 14 }}>
                <Text style={{ fontSize: 12, fontWeight: "700", color: C.creamFaint, letterSpacing: 1.5, textTransform: "uppercase" }}>
                  Recently Added
                </Text>
                <Ionicons name="chevron-forward" size={14} color={C.creamFaint} />
              </View>
              <FlatList
                data={recent}
                keyExtractor={(item) => `hero-${item.id}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                renderItem={({ item }) => (
                  <HeroCard item={item} onPress={() => goTo(item)} />
                )}
              />
            </View>

            {/* ── ALL EPISODES LIST ── */}
            <View style={{ paddingHorizontal: 20 }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
                <Text style={{ fontSize: 12, fontWeight: "700", color: C.creamFaint, letterSpacing: 1.5, textTransform: "uppercase" }}>
                  All Episodes
                </Text>
                <View style={{ flex: 1, height: 1, backgroundColor: C.rim, marginLeft: 12 }} />
              </View>

              {all.map((item, idx) => (
                <RowCard key={item.id} item={item} index={idx} onPress={() => goTo(item)} />
              ))}
            </View>
          </ScrollView>

          {/* ── FAB ── */}
          <FAB onPress={() => router.navigate("/(tabs)/upload")} />
        </>
      )}
    </SafeAreaView>
  );
}
