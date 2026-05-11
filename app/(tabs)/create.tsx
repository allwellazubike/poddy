import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants";
import { ScreenHeader } from "@/components/ui";

export default function CreateScreen() {
  return (
    <SafeAreaView className="flex-1 bg-poddy-bg" edges={["top"]}>
      <ScreenHeader title="Create" subtitle="Generate a podcast from any PDF" />

      <View className="flex-1 items-center justify-center px-8">
        {/* Upload area */}
        <View className="w-full rounded-2xl border-2 border-dashed border-poddy-border items-center justify-center py-16 mb-8">
          <View className="w-16 h-16 rounded-2xl bg-poddy-accent-soft items-center justify-center mb-4">
            <Ionicons name="cloud-upload-outline" size={32} color={Colors.accent} />
          </View>
          <Text className="text-poddy-text-primary text-[16px] font-semibold mb-1">
            Tap to upload a PDF
          </Text>
          <Text className="text-poddy-text-muted text-[13px]">
            Max file size: 5MB
          </Text>
        </View>

        {/* Custom instructions */}
        <View className="w-full bg-poddy-surface border border-poddy-border rounded-xl p-4 mb-6">
          <Text className="text-poddy-text-secondary text-[13px] mb-2">
            Custom instructions (optional)
          </Text>
          <Text className="text-poddy-text-muted text-[13px] italic">
            e.g. Focus on inheritance and polymorphism
          </Text>
        </View>

        {/* Visibility toggle */}
        <View className="w-full flex-row items-center justify-between bg-poddy-surface border border-poddy-border rounded-xl px-4 py-3 mb-6">
          <View className="flex-row items-center">
            <Ionicons name="globe-outline" size={18} color={Colors.textSecondary} />
            <Text className="text-poddy-text-primary text-[14px] font-medium ml-3">
              Make public
            </Text>
          </View>
          <View className="w-10 h-6 rounded-full bg-poddy-accent items-end justify-center px-0.5">
            <View className="w-5 h-5 rounded-full bg-white" />
          </View>
        </View>

        {/* Generate button */}
        <TouchableOpacity
          className="w-full bg-poddy-accent rounded-xl py-4 items-center"
          activeOpacity={0.8}
        >
          <Text className="text-white text-[16px] font-bold">
            Generate Podcast
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
