import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { apiFetch } from "@/utils";
import { DiscoverRow } from "@/components/home";
import { Podcast } from "@/types/podcast";

export default function CategoryScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const decodedName = decodeURIComponent(name || "");

  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Podcast[]>(`/podcasts/feed?category=${encodeURIComponent(decodedName)}`)
      .then(setPodcasts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [decodedName]);

  return (
    <SafeAreaView style={s.screen} edges={["top"]}>
      {/* Header */}
      <View style={s.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [s.back, pressed && { opacity: 0.5 }]}
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={22} color="#111111" />
        </Pressable>
        <Text style={s.title}>{decodedName}</Text>
      </View>

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator color="#1A1A1A" />
        </View>
      ) : podcasts.length > 0 ? (
        <ScrollView
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
        >
          {podcasts.map((podcast) => (
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
          ))}
        </ScrollView>
      ) : (
        <View style={s.empty}>
          <View style={s.emptyIcon}>
            <Ionicons name="mic-outline" size={28} color="#888888" />
          </View>
          <Text style={s.emptyTitle}>No podcasts yet</Text>
          <Text style={s.emptySub}>
            Be the first to create a {decodedName} podcast.
          </Text>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/(tabs)/create",
                params: { category: decodedName },
              })
            }
            style={({ pressed }) => [s.btn, pressed && { opacity: 0.8 }]}
          >
            <Text style={s.btnText}>Create podcast</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F5F5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    gap: 14,
  },
  back: {},
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    color: "#111111",
    letterSpacing: -0.3,
  },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  list: { paddingHorizontal: 20, paddingBottom: 80 },

  empty: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 48,
    alignItems: "flex-start",
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: "#111111",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  emptySub: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#888888",
    lineHeight: 22,
    marginBottom: 24,
  },
  btn: {
    height: 48,
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#FFFFFF",
  },
});
