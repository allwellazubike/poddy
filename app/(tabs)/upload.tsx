import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UploadScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0D0C0A" }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: "800", color: "#F2EDE6", letterSpacing: -0.5 }}>
          Upload
        </Text>
        <Text style={{ fontSize: 13, color: "#6A6258", marginTop: 6 }}>
          Coming soon...
        </Text>
      </View>
    </SafeAreaView>
  );
}
