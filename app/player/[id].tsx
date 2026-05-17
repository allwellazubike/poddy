import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { router, useLocalSearchParams } from "expo-router";
import { apiFetch } from "@/utils";
import { PodcastStatus } from "@/types/podcast";

const STEP_ORDER = ["uploaded", "extracting", "writing", "synthesizing", "done"];
const STEP_LABELS: Record<string, string> = {
  uploaded: "Preparing file",
  extracting: "Reading PDF",
  writing: "Writing script",
  synthesizing: "Generating audio",
  done: "Done",
};

// ── Processing Steps ──────────────────────────────────────────────────
function ProcessingSteps({ currentStatus }: { currentStatus: string }) {
  const currentIdx = STEP_ORDER.indexOf(currentStatus);

  return (
    <View style={ps.container}>
      {STEP_ORDER.slice(0, -1).map((step, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;
        return (
          <View key={step} style={ps.row}>
            <View style={[ps.dot, done && ps.dotDone, active && ps.dotActive]}>
              {done ? (
                <Ionicons name="checkmark" size={12} color="#FFFFFF" />
              ) : (
                <View
                  style={[
                    ps.inner,
                    active && ps.innerActive,
                  ]}
                />
              )}
            </View>
            <Text style={[ps.label, (done || active) && ps.labelActive]}>
              {STEP_LABELS[step]}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const ps = StyleSheet.create({
  container: { width: "100%", paddingHorizontal: 32, marginTop: 40 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  dotDone: { backgroundColor: "#1A1A1A" },
  dotActive: { backgroundColor: "#FFFFFF", borderWidth: 2, borderColor: "#1A1A1A" },
  inner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
  },
  innerActive: { backgroundColor: "#1A1A1A" },
  label: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#AAAAAA",
  },
  labelActive: {
    fontFamily: "Inter_500Medium",
    color: "#111111",
  },
});

// ── Audio Player ──────────────────────────────────────────────────────
function AudioPlayer({ audioUrl }: { audioUrl: string }) {
  const sound = useRef<Audio.Sound | null>(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!audioUrl?.startsWith("http")) { setLoading(false); return; }
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: true });
        const { sound: s } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: false },
          (status) => {
            if (!mounted || !status.isLoaded) return;
            setPosition(status.positionMillis);
            setDuration(status.durationMillis || 0);
            setPlaying(status.isPlaying);
          }
        );
        sound.current = s;
        if (mounted) setLoading(false);
      } catch { if (mounted) setLoading(false); }
    })();
    return () => {
      mounted = false;
      sound.current?.unloadAsync();
    };
  }, [audioUrl]);

  const toggle = async () => {
    if (!sound.current) return;
    playing ? await sound.current.pauseAsync() : await sound.current.playAsync();
  };

  const skip = async (ms: number) => {
    if (!sound.current) return;
    await sound.current.setPositionAsync(Math.max(0, Math.min(position + ms, duration)));
  };

  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  const progress = duration > 0 ? position / duration : 0;

  if (loading) {
    return (
      <View style={{ marginTop: 32, alignItems: "center" }}>
        <ActivityIndicator color="#1A1A1A" />
        <Text style={ap.hint}>Loading audio…</Text>
      </View>
    );
  }

  return (
    <View style={ap.container}>
      {/* Progress bar */}
      <View style={ap.track}>
        <View style={[ap.fill, { width: `${progress * 100}%` }]} />
      </View>

      {/* Time */}
      <View style={ap.times}>
        <Text style={ap.time}>{fmt(position)}</Text>
        <Text style={ap.time}>{fmt(duration)}</Text>
      </View>

      {/* Controls */}
      <View style={ap.controls}>
        <Pressable
          onPress={() => skip(-15000)}
          style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
          hitSlop={8}
        >
          <Ionicons name="play-back" size={26} color="#888888" />
        </Pressable>

        <Pressable
          onPress={toggle}
          style={({ pressed }) => [ap.playBtn, pressed && { opacity: 0.85 }]}
        >
          <Ionicons
            name={playing ? "pause" : "play"}
            size={26}
            color="#FFFFFF"
            style={!playing ? { marginLeft: 3 } : undefined}
          />
        </Pressable>

        <Pressable
          onPress={() => skip(15000)}
          style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
          hitSlop={8}
        >
          <Ionicons name="play-forward" size={26} color="#888888" />
        </Pressable>
      </View>
    </View>
  );
}

const ap = StyleSheet.create({
  container: { width: "100%", paddingHorizontal: 28, marginTop: 24 },
  track: {
    height: 3,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 8,
  },
  fill: { height: "100%", backgroundColor: "#1A1A1A", borderRadius: 2 },
  times: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  time: { fontFamily: "Inter_400Regular", fontSize: 12, color: "#888888" },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 36,
  },
  playBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  hint: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "#888888",
    marginTop: 8,
  },
});

// ── Main Player Screen ────────────────────────────────────────────────
export default function PlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [status, setStatus] = useState<PodcastStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const pollStatus = useCallback(async () => {
    try {
      const data = await apiFetch<PodcastStatus>(`/podcasts/${id}/status`);
      setStatus(data);
      if (data.status === "done" || data.status === "failed") {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch status");
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [id]);

  useEffect(() => {
    pollStatus();
    intervalRef.current = setInterval(pollStatus, 3000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [pollStatus]);

  const currentStatus = status?.status || "uploaded";
  const isDone = currentStatus === "done";
  const isFailed = currentStatus === "failed";

  return (
    <SafeAreaView style={pl.screen} edges={["top"]}>
      {/* Back button */}
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => [pl.back, pressed && { opacity: 0.5 }]}
        hitSlop={8}
      >
        <Ionicons name="arrow-back" size={22} color="#111111" />
      </Pressable>

      <View style={pl.body}>
        {error ? (
          // ── Error ──
          <View style={pl.centered}>
            <View style={pl.stateIcon}>
              <Ionicons name="alert-circle-outline" size={32} color="#DC2626" />
            </View>
            <Text style={pl.stateTitle}>Something went wrong</Text>
            <Text style={pl.stateSub}>{error}</Text>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [pl.btn, pressed && { opacity: 0.8 }]}
            >
              <Text style={pl.btnText}>Go back</Text>
            </Pressable>
          </View>
        ) : isFailed ? (
          // ── Failed ──
          <View style={pl.centered}>
            <View style={pl.stateIcon}>
              <Ionicons name="alert-circle-outline" size={32} color="#DC2626" />
            </View>
            <Text style={pl.stateTitle}>Generation failed</Text>
            <Text style={pl.stateSub}>
              Something went wrong in the pipeline. Please try again.
            </Text>
            <Pressable
              onPress={() => router.replace("/(tabs)/create")}
              style={({ pressed }) => [pl.btn, pressed && { opacity: 0.8 }]}
            >
              <Text style={pl.btnText}>Try again</Text>
            </Pressable>
          </View>
        ) : isDone && status?.audioUrl ? (
          // ── Player ──
          <View style={pl.playerWrap}>
            <View style={pl.artwork}>
              <Ionicons name="headset" size={48} color="#888888" />
            </View>
            <Text style={pl.playerTitle}>Ready to play</Text>
            <Text style={pl.playerSub}>Your podcast is ready</Text>
            <AudioPlayer audioUrl={status.audioUrl} />
          </View>
        ) : (
          // ── Processing ──
          <View style={pl.centered}>
            <Animated.View
              style={[
                pl.processingIcon,
                {
                  opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
                },
              ]}
            >
              <Ionicons name="mic-outline" size={32} color="#888888" />
            </Animated.View>
            <Text style={pl.stateTitle}>Generating your podcast</Text>
            <Text style={pl.stateSub}>This usually takes a minute or two</Text>
            <ProcessingSteps currentStatus={currentStatus} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const pl = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F5F5" },
  back: {
    marginLeft: 20,
    marginTop: 12,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1, alignItems: "center", justifyContent: "center" },

  centered: { alignItems: "center", paddingHorizontal: 32, width: "100%" },

  stateIcon: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  processingIcon: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  stateTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 17,
    color: "#111111",
    marginBottom: 8,
    textAlign: "center",
  },
  stateSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#888888",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 28,
  },
  btn: {
    height: 48,
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#FFFFFF",
  },

  playerWrap: { width: "100%", alignItems: "center" },
  artwork: {
    width: 140,
    height: 140,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  playerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: "#111111",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  playerSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#888888",
    marginBottom: 4,
  },
});
