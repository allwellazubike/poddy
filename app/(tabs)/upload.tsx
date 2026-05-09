import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UploadScreen() {
  return (
    <SafeAreaView className="flex-1 bg-paper">
      <View className="flex-1 items-center justify-center px-6">
        <Text
          style={{
            fontSize: 20,
            fontWeight: "800",
            color: "#0a0a0a",
            letterSpacing: -0.5,
          }}
        >
          Upload
        </Text>
        <Text style={{ fontSize: 13, color: "#8a8a8a", marginTop: 6 }}>
          Coming soon...
        </Text>
      </View>
    </SafeAreaView>
  );
}
