import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Missing Fields", "Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Login Failed", err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              paddingHorizontal: 24,
            }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={{ marginBottom: 48 }}>
              <Text
                style={{
                  fontFamily: "Inter_800ExtraBold",
                  fontSize: 40,
                  color: Colors.textPrimary,
                  letterSpacing: -1,
                  marginBottom: 8,
                }}
              >
                Sign In
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 16,
                  color: Colors.textSecondary,
                  letterSpacing: 0,
                }}
              >
                Welcome back to Poddy.
              </Text>
            </View>

            {/* Email Input */}
            <View style={{ marginBottom: 32 }}>
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 12,
                  color: Colors.textSecondary,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 8,
                }}
              >
                Email
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={Colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 18,
                  color: Colors.textPrimary,
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.border,
                }}
                editable={!loading}
              />
            </View>

            {/* Password Input */}
            <View style={{ marginBottom: 48 }}>
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 12,
                  color: Colors.textSecondary,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 8,
                }}
              >
                Password
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.border,
                }}
              >
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={Colors.textMuted}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  style={{
                    flex: 1,
                    fontFamily: "Inter_500Medium",
                    fontSize: 18,
                    color: Colors.textPrimary,
                    paddingVertical: 12,
                  }}
                  editable={!loading}
                />
                <Pressable
                  onPress={() => setShowPassword((p) => !p)}
                  style={{ padding: 8, marginRight: -8 }}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={Colors.textSecondary}
                  />
                </Pressable>
              </View>
            </View>

            {/* Submit Button */}
            <Pressable
              onPress={handleLogin}
              disabled={loading}
              style={({ pressed }) => ({
                width: "100%",
                height: 56,
                backgroundColor: loading ? Colors.border : Colors.textPrimary,
                borderRadius: 4,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row" as const,
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
                marginBottom: 32,
              })}
            >
              {loading ? (
                <ActivityIndicator color={Colors.bg} />
              ) : (
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    color: Colors.bg,
                    fontSize: 16,
                    letterSpacing: 0.5,
                  }}
                >
                  Sign In
                </Text>
              )}
            </Pressable>

            {/* Footer */}
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Text style={{ fontFamily: "Inter_400Regular", color: Colors.textSecondary }}>
                Don't have an account?{" "}
              </Text>
              <Pressable onPress={() => router.push("/(auth)/register")}>
                <Text style={{ fontFamily: "Inter_600SemiBold", color: Colors.textPrimary }}>
                  Create one
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
