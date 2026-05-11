import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, MOCK_MY_PODCASTS, MOCK_DISCOVER } from "@/constants";
import { Podcast } from "@/types/podcast";
import { PublicPodcast } from "@/types/podcast";
import { ScreenHeader } from "@/components/ui";
import {
  HomeSkeleton,
  RecentSection,
  DiscoverSection,
} from "@/components/home";

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
