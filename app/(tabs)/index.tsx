import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/utils/mock-auth";
import { Colors } from "@/constants";
import { Podcast } from "@/types/podcast";
import { apiFetch } from "@/utils";
import { ScreenHeader } from "@/components/ui";
import {
  HomeSkeleton,
  RecentSection,
  DiscoverSection,
} from "@/components/home";

export default function HomeScreen() {
  const { getToken } = useAuth();

  const [myPodcasts, setMyPodcasts] = useState<Podcast[]>([]);
  const [discover, setDiscover] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const token = await getToken();

      const [mine, feed] = await Promise.all([
        apiFetch<Podcast[]>("/", token),
        apiFetch<Podcast[]>("/feed", token),
      ]);

      setMyPodcasts(mine.filter((p) => p.status === "done"));
      setDiscover(feed);
    } catch (err) {
      console.error("Failed to load home data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getToken]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  return (
    <SafeAreaView className="flex-1 bg-poddy-bg" edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accent}
            colors={[Colors.accent]}
          />
        }
      >
        <ScreenHeader
          title="Poddy"
          showProfile
          onProfilePress={() => {
            /* TODO: navigate to profile */
          }}
        />

        {loading ? (
          <HomeSkeleton />
        ) : (
          <>
            <RecentSection podcasts={myPodcasts} />
            <DiscoverSection podcasts={discover} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
