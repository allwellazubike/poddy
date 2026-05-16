import { Colors } from "@/constants";
import { useAuth } from "@/context/AuthContext";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const { register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email.trim() || !password || !confirmPassword) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Weak Password",
        "Password must be at least 6 characters.",
      );
      return;
    }

    setLoading(true);
    try {
      await register(email.trim(), password);
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert(
        "Registration Failed",
        err.message || "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-poddy-bg" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 32,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo / Branding */}
          <View className="items-center mb-10">
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                backgroundColor: Colors.accentSoft,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Ionicons name="headset" size={36} color={Colors.accent} />
            </View>
            <Text className="text-poddy-text-primary text-[28px] font-bold mb-1">
              Create account
            </Text>
            <Text className="text-poddy-text-secondary text-[15px]">
              Join Poddy and start generating podcasts
            </Text>
          </View>

          {/* Email input */}
          <View className="mb-4">
            <Text className="text-poddy-text-secondary text-[13px] font-medium mb-2 ml-1">
              Email
            </Text>
            <View className="flex-row items-center bg-poddy-surface border border-poddy-border rounded-xl px-4 py-3">
              <Ionicons
                name="mail-outline"
                size={18}
                color={Colors.textMuted}
                style={{ marginRight: 10 }}
              />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={Colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                className="flex-1 text-poddy-text-primary text-[15px]"
                style={{ padding: 0 }}
                editable={!loading}
              />
            </View>
          </View>

          {/* Password input */}
          <View className="mb-4">
            <Text className="text-poddy-text-secondary text-[13px] font-medium mb-2 ml-1">
              Password
            </Text>
            <View className="flex-row items-center bg-poddy-surface border border-poddy-border rounded-xl px-4 py-3">
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={Colors.textMuted}
                style={{ marginRight: 10 }}
              />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Min. 6 characters"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                className="flex-1 text-poddy-text-primary text-[15px]"
                style={{ padding: 0 }}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((p) => !p)}
                activeOpacity={0.6}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm password input */}
          <View className="mb-6">
            <Text className="text-poddy-text-secondary text-[13px] font-medium mb-2 ml-1">
              Confirm Password
            </Text>
            <View className="flex-row items-center bg-poddy-surface border border-poddy-border rounded-xl px-4 py-3">
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={Colors.textMuted}
                style={{ marginRight: 10 }}
              />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repeat your password"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                className="flex-1 text-poddy-text-primary text-[15px]"
                style={{ padding: 0 }}
                editable={!loading}
              />
            </View>
          </View>

          {/* Create account button */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
            style={{
              backgroundColor: loading ? Colors.border : Colors.accent,
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-[16px] font-bold">
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          {/* Navigate to login */}
          <View className="flex-row justify-center">
            <Text className="text-poddy-text-secondary text-[14px]">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/login")}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  color: Colors.accent,
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
