import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform, View } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#161410",
          borderTopColor: "#2E2C28",
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 88 : 65,
          paddingBottom: Platform.OS === "ios" ? 28 : 10,
          paddingTop: 10,
          elevation: 0,
        },
        tabBarActiveTintColor: "#F4A535",
        tabBarInactiveTintColor: "#6A6258",
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          letterSpacing: 0.8,
          textTransform: "uppercase",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Library",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 36,
                height: 28,
                borderRadius: 8,
                backgroundColor: focused ? "#1E1A08" : "transparent",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name={focused ? "headset" : "headset-outline"}
                size={20}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: "Upload",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 36,
                height: 28,
                borderRadius: 8,
                backgroundColor: focused ? "#1E1A08" : "transparent",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name={focused ? "cloud-upload" : "cloud-upload-outline"}
                size={20}
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
