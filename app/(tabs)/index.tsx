import {
  DiscoverSection,
  HomeSkeleton,
  RecentSection,
} from "@/components/home";
import { ScreenHeader } from "@/components/ui";
import { Colors } from "@/constants";
import { Podcast } from "@/types/podcast";
import { apiFetch } from "@/utils";

import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {


  const [myPodcasts, setMyPodcasts] = useState<Podcast[]>([]);
  const [discover, setDiscover] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [mine, feed] = await Promise.all([
        apiFetch<Podcast[]>("/"),
        apiFetch<Podcast[]>("/feed"),
      ]);

      setMyPodcasts(mine.filter((p) => p.status === "done"));
      setDiscover(feed);
    } catch (err) {
      console.error("Failed to load home data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

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
