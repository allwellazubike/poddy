import "./global.css";
import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-bold text-purple-600">
        Welcome to Expo + NativeWind!
      </Text>
      <Text className="mt-4 text-lg text-gray-600">
        Start building your app with TailwindCSS
      </Text>
    </View>
  );
}
