import {
  DiscoverSection,
  HomeSkeleton,
  LibrarySection,
  HomeEmptyState,
  HomeHeader,
} from "@/components/home";
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
        apiFetch<Podcast[]>("/podcasts"),
        apiFetch<Podcast[]>("/podcasts/feed?random=true"),
      ]);

      setMyPodcasts(mine);
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }} edges={["top"]}>
      <HomeHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80, flexGrow: 1, paddingTop: 4 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#1A1A1A"]}
            tintColor="#1A1A1A"
          />
        }
      >
        {loading ? (
          <HomeSkeleton />
        ) : myPodcasts.length === 0 && discover.length === 0 ? (
          <HomeEmptyState />
        ) : (
          <>
            <LibrarySection podcasts={myPodcasts} />
            <DiscoverSection podcasts={discover} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
