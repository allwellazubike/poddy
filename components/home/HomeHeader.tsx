import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants";
import { router } from "expo-router";

export function HomeHeader() {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 24,
        backgroundColor: Colors.bg,
      }}
    >
      <Text
        style={{
          fontFamily: "Inter_900Black",
          fontSize: 28,
          color: Colors.textPrimary,
          letterSpacing: -1,
          textTransform: "uppercase",
        }}
      >
        Poddy.
      </Text>
      <Pressable
        onPress={() => router.push("/profile")}
        style={({ pressed }) => ({
          opacity: pressed ? 0.5 : 1,
        })}
      >
        <Ionicons name="person" size={20} color={Colors.textPrimary} />
      </Pressable>
    </View>
  );
}
