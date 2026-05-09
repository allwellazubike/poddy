import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform, View } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#e8e8e8",
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 88 : 65,
          paddingBottom: Platform.OS === "ios" ? 30 : 10,
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: "#0a0a0a",
        tabBarInactiveTintColor: "#b0b0b0",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          letterSpacing: 0.5,
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
                width: 32,
                height: 32,
                borderRadius: 10,
                backgroundColor: focused ? "#0a0a0a" : "transparent",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name={focused ? "library" : "library-outline"}
                size={18}
                color={focused ? "#ffffff" : color}
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
                width: 32,
                height: 32,
                borderRadius: 10,
                backgroundColor: focused ? "#0a0a0a" : "transparent",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name={focused ? "add-circle" : "add-circle-outline"}
                size={18}
                color={focused ? "#ffffff" : color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
