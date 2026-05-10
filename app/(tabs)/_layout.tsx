import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform, View } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#080808",
          borderTopColor: "#222222",
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 88 : 65,
          paddingBottom: Platform.OS === "ios" ? 30 : 10,
          paddingTop: 8,
          elevation: 0,
        },
        tabBarActiveTintColor: "#EEEEEE",
        tabBarInactiveTintColor: "#555555",
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Library",
          tabBarIcon: ({ color, focused }) => (
            <View className="relative items-center justify-center">
              <Ionicons
                name={focused ? "library" : "library-outline"}
                size={22}
                color={color}
              />
              {focused && (
                <View className="absolute -bottom-4 w-1 h-1 rounded-full bg-poddy-accent" />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: "Upload",
          tabBarIcon: ({ color, focused }) => (
            <View className="relative items-center justify-center">
              <Ionicons
                name={focused ? "cloud-upload" : "cloud-upload-outline"}
                size={24}
                color={color}
              />
              {focused && (
                <View className="absolute -bottom-4 w-1 h-1 rounded-full bg-poddy-accent" />
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
