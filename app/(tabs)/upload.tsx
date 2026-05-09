import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UploadScreen() {
  return (
    <SafeAreaView className="flex-1 bg-poddy-bg">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-white text-lg font-semibold">Upload Screen</Text>
        <Text className="text-poddy-text-muted text-sm mt-2">
          Coming soon...
        </Text>
      </View>
    </SafeAreaView>
  );
}
