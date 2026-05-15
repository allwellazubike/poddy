import { Colors } from "@/constants";
import { PodcastStatus } from "@/types/podcast";
import { apiFetch } from "@/utils";

import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// step labels
const STATUS_LABELS: Record<string, { label: string; icon: string }> = {
  uploaded: { label: "Preparing your file…", icon: "cloud-upload" },
  extracting: { label: "Extracting text from PDF…", icon: "document-text" },
  writing: { label: "Poddy is writing your script…", icon: "pencil" },
  synthesizing: { label: "Generating audio…", icon: "mic" },
  done: { label: "Your podcast is ready!", icon: "checkmark-circle" },
  failed: { label: "Something went wrong", icon: "alert-circle" },
};

//  step progress 

const STEP_ORDER = [
  "uploaded",
  "extracting",
  "writing",
  "synthesizing",
  "done",
];

function ProcessingSteps({ currentStatus }: { currentStatus: string }) {
  const currentIdx = STEP_ORDER.indexOf(currentStatus);

  return (
    <View style={{ width: "100%", paddingHorizontal: 32, marginTop: 32 }}>
      {STEP_ORDER.slice(0, -1).map((step, idx) => {
        const isComplete = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const info = STATUS_LABELS[step];

        return (
          <View key={step} className="flex-row items-center mb-4">
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: isComplete
                  ? Colors.accent
                  : isCurrent
                    ? Colors.accentSoft
                    : Colors.border,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              {isComplete ? (
                <Ionicons name="checkmark" size={16} color="#fff" />
              ) : (
                <Ionicons
                  name={info.icon as any}
                  size={14}
                  color={isCurrent ? Colors.accent : Colors.textMuted}
                />
              )}
            </View>
            <Text
              style={{
                fontSize: 13,
                fontWeight: isCurrent ? "600" : "400",
                color:
                  isComplete || isCurrent
                    ? Colors.textPrimary
                    : Colors.textMuted,
              }}
            >
              {info.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

// ─── Audio Player ────────────────────────────────────────────────────

function AudioPlayer({ audioUrl }: { audioUrl: string }) {
  const sound = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSound() {
      if (!audioUrl || !audioUrl.startsWith("http")) {
        console.log("Audio URL is not ready yet:", audioUrl);
        if (mounted) setIsLoading(false);
        return;
      }

      try {
        console.log("Loading valid audio URL:", audioUrl);
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
        });

        const { sound: s } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: false },
          (status) => {
            if (!mounted || !status.isLoaded) return;
            setPosition(status.positionMillis);
            setDuration(status.durationMillis || 0);
            setIsPlaying(status.isPlaying);
          },
        );
        sound.current = s;
        if (mounted) setIsLoading(false);
      } catch (err) {
        console.error("Audio load error:", err);
        if (mounted) setIsLoading(false);
      }
    }

    loadSound();

    return () => {
      mounted = false;
      if (sound.current) {
        sound.current.unloadAsync();
      }
    };
  }, [audioUrl]);

  const togglePlayPause = async () => {
    if (!sound.current) return;
    if (isPlaying) {
      await sound.current.pauseAsync();
    } else {
      await sound.current.playAsync();
    }
  };

  const skip = async (ms: number) => {
    if (!sound.current) return;
    const newPos = Math.max(0, Math.min(position + ms, duration));
    await sound.current.setPositionAsync(newPos);
  };

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? position / duration : 0;

  if (isLoading) {
    return (
      <View className="items-center mt-8">
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text className="text-poddy-text-muted text-[13px] mt-3">
          Loading audio…
        </Text>
      </View>
    );
  }

  return (
    <View className="w-full px-8 mt-6">
      {/* Progress bar */}
      <View
        style={{
          height: 4,
          backgroundColor: Colors.border,
          borderRadius: 2,
          marginBottom: 8,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: 4,
            width: `${progress * 100}%`,
            backgroundColor: Colors.accent,
            borderRadius: 2,
          }}
        />
      </View>

      {/* Time labels */}
      <View className="flex-row justify-between mb-6">
        <Text className="text-poddy-text-muted text-[11px]">
          {formatTime(position)}
        </Text>
        <Text className="text-poddy-text-muted text-[11px]">
          {formatTime(duration)}
        </Text>
      </View>

      {/* Controls */}
      <View className="flex-row items-center justify-center">
        {/* Skip back 15s */}
        <TouchableOpacity
          onPress={() => skip(-15000)}
          activeOpacity={0.6}
          style={{ marginRight: 28 }}
        >
          <Ionicons name="play-back" size={28} color={Colors.textSecondary} />
        </TouchableOpacity>

        {/* Play / Pause */}
        <TouchableOpacity
          onPress={togglePlayPause}
          activeOpacity={0.8}
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: Colors.accent,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={28}
            color="#fff"
            style={isPlaying ? {} : { marginLeft: 3 }}
          />
        </TouchableOpacity>

        {/* Skip forward 15s */}
        <TouchableOpacity
          onPress={() => skip(15000)}
          activeOpacity={0.6}
          style={{ marginLeft: 28 }}
        >
          <Ionicons
            name="play-forward"
            size={28}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Main Player Screen ──────────────────────────────────────────────

export default function PlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [status, setStatus] = useState<PodcastStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Pulsing animation for the loading icon
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [animValue]);

  const scaleInterpolation = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  const opacityInterpolation = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
  });

  // Polling logic
  const pollStatus = useCallback(async () => {
    try {
      const data = await apiFetch<PodcastStatus>(`/${id}/status`);
      setStatus(data);

      // Stop polling when done or failed
      if (data.status === "done" || data.status === "failed") {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch status");
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [id]);

  useEffect(() => {
    // Initial fetch
    pollStatus();

    // Start polling every 3 seconds
    intervalRef.current = setInterval(pollStatus, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [pollStatus]);

  const currentStatus = status?.status || "uploaded";
  const statusInfo = STATUS_LABELS[currentStatus] || STATUS_LABELS.uploaded;
  const isDone = currentStatus === "done";
  const isFailed = currentStatus === "failed";

  return (
    <SafeAreaView className="flex-1 bg-poddy-bg" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-2">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="w-9 h-9 rounded-full bg-poddy-surface border border-poddy-border items-center justify-center mr-3"
        >
          <Ionicons name="chevron-back" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text className="text-poddy-text-primary text-[18px] font-bold flex-1">
          {isDone ? "Now Playing" : "Generating…"}
        </Text>
      </View>

      <View className="flex-1 items-center justify-center">
        {error ? (
          /* Error state */
          <View className="items-center px-8">
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 24,
                backgroundColor: "#FEE2E2",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Ionicons name="alert-circle" size={40} color="#DC2626" />
            </View>
            <Text className="text-poddy-text-primary text-[17px] font-semibold mb-2">
              Something went wrong
            </Text>
            <Text className="text-poddy-text-secondary text-[14px] text-center mb-6">
              {error}
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: Colors.accent,
                borderRadius: 12,
                paddingVertical: 12,
                paddingHorizontal: 32,
              }}
            >
              <Text className="text-white text-[14px] font-semibold">
                Go Back
              </Text>
            </TouchableOpacity>
          </View>
        ) : isFailed ? (
          /* Failed pipeline state */
          <View className="items-center px-8">
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 24,
                backgroundColor: "#FEE2E2",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Ionicons name="alert-circle" size={40} color="#DC2626" />
            </View>
            <Text className="text-poddy-text-primary text-[17px] font-semibold mb-2">
              Generation Failed
            </Text>
            <Text className="text-poddy-text-secondary text-[14px] text-center mb-6">
              The pipeline encountered an error. Please try uploading again.
            </Text>
            <TouchableOpacity
              onPress={() => router.replace("/(tabs)/create")}
              style={{
                backgroundColor: Colors.accent,
                borderRadius: 12,
                paddingVertical: 12,
                paddingHorizontal: 32,
              }}
            >
              <Text className="text-white text-[14px] font-semibold">
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        ) : isDone && status?.audioUrl ? (
          /* Success — audio player */
          <View className="w-full items-center">
            {/* Album art / icon */}
            <View
              style={{
                width: 160,
                height: 160,
                borderRadius: 32,
                backgroundColor: Colors.accentSoft,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <Ionicons name="headset" size={64} color={Colors.accent} />
            </View>

            <Text className="text-poddy-text-primary text-[18px] font-bold mb-1">
              Podcast Ready
            </Text>
            <Text className="text-poddy-text-secondary text-[13px] mb-4">
              Your podcast has been generated
            </Text>

            <AudioPlayer audioUrl={status.audioUrl} />
          </View>
        ) : (
          /* Processing — loading state with steps */
          <View className="items-center w-full">
            <Animated.View
              style={{
                width: 80,
                height: 80,
                borderRadius: 24,
                backgroundColor: Colors.accentSoft,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
                transform: [{ scale: scaleInterpolation }],
                opacity: opacityInterpolation,
              }}
            >
              <Ionicons
                name={statusInfo.icon as any}
                size={36}
                color={Colors.accent}
              />
            </Animated.View>

            <Text className="text-poddy-text-primary text-[17px] font-semibold mb-1">
              {statusInfo.label}
            </Text>
            <Text className="text-poddy-text-muted text-[13px]">
              This may take a minute…
            </Text>

            <ProcessingSteps currentStatus={currentStatus} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
