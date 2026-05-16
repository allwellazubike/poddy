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
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await register(email.trim(), password);
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Registration Failed", err.message || "Something went wrong.");
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
                Create Account
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 16,
                  color: Colors.textSecondary,
                  letterSpacing: 0,
                }}
              >
                Join Poddy and start generating.
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
                  placeholder="Min. 6 characters"
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

            {/* Confirm Password Input */}
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
                Confirm Password
              </Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repeat password"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
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

            {/* Submit Button */}
            <Pressable
              onPress={handleRegister}
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
                  Create Account
                </Text>
              )}
            </Pressable>

            {/* Footer */}
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Text style={{ fontFamily: "Inter_400Regular", color: Colors.textSecondary }}>
                Already have an account?{" "}
              </Text>
              <Pressable onPress={() => router.push("/(auth)/login")}>
                <Text style={{ fontFamily: "Inter_600SemiBold", color: Colors.textPrimary }}>
                  Sign In
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
