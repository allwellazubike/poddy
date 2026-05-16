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

/** Auth-specific color palette — matches the Google Stitch design. */
const AC = {
  background: "#f8f9fa",
  surface: "rgba(255, 255, 255, 0.85)",
  surfaceLow: "#f3f4f5",
  surfaceVariant: "#e1e3e4",
  primary: "#4f46e5",
  primaryDark: "#3525cd",
  onPrimary: "#ffffff",
  onBackground: "#191c1d",
  onSurfaceVariant: "#464555",
  outline: "#777587",
  outlineVariant: "rgba(199, 196, 216, 0.5)",
  primaryFixed: "#e2dfff",
  primaryFixedDim: "#c3c0ff",
  tertiaryFixedDim: "rgba(78, 222, 163, 0.2)",
};

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
    <View style={{ flex: 1, backgroundColor: AC.background }}>
      {/* ── Decorative Blobs ────────────────────────────────── */}
      <View
        style={{
          position: "absolute",
          top: -80,
          left: -80,
          width: 340,
          height: 340,
          borderRadius: 170,
          backgroundColor: AC.primaryFixedDim,
          opacity: 0.3,
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: 200,
          backgroundColor: AC.tertiaryFixedDim,
          opacity: 0.5,
        }}
      />

      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              paddingHorizontal: 20,
            }}
            keyboardShouldPersistTaps="handled"
          >
            {/* ── Glass Card ─────────────────────────────────── */}
            <View
              style={{
                backgroundColor: AC.surface,
                borderRadius: 24,
                padding: 32,
                borderWidth: 1,
                borderColor: "rgba(225, 227, 228, 0.5)",
                shadowColor: "#4f46e5",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.06,
                shadowRadius: 32,
                elevation: 8,
                alignItems: "center",
              }}
            >
              {/* Logo */}
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 16,
                  backgroundColor: AC.primaryFixed,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 24,
                  shadowColor: "#4f46e5",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.08,
                  shadowRadius: 12,
                  elevation: 3,
                }}
              >
                <Ionicons name="headset" size={40} color={AC.primary} />
              </View>

              {/* Heading */}
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "700",
                  color: AC.onBackground,
                  marginBottom: 8,
                  textAlign: "center",
                }}
              >
                Create Account
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: AC.onSurfaceVariant,
                  marginBottom: 32,
                  textAlign: "center",
                }}
              >
                Join Poddy and start creating podcasts.
              </Text>

              {/* ── Email Input ──────────────────────────────── */}
              <View style={{ width: "100%", marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "500",
                    color: AC.onBackground,
                    marginBottom: 6,
                    marginLeft: 2,
                  }}
                >
                  Email Address
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: AC.surfaceLow,
                    borderRadius: 12,
                    height: 56,
                    paddingHorizontal: 16,
                  }}
                >
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={AC.onSurfaceVariant}
                    style={{ marginRight: 12 }}
                  />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@example.com"
                    placeholderTextColor={AC.outline}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={{
                      flex: 1,
                      fontSize: 16,
                      color: AC.onBackground,
                      padding: 0,
                    }}
                    editable={!loading}
                  />
                </View>
              </View>

              {/* ── Password Input ───────────────────────────── */}
              <View style={{ width: "100%", marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "500",
                    color: AC.onBackground,
                    marginBottom: 6,
                    marginLeft: 2,
                  }}
                >
                  Password
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: AC.surfaceLow,
                    borderRadius: 12,
                    height: 56,
                    paddingHorizontal: 16,
                  }}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={AC.onSurfaceVariant}
                    style={{ marginRight: 12 }}
                  />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Create a password"
                    placeholderTextColor={AC.outline}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    style={{
                      flex: 1,
                      fontSize: 16,
                      color: AC.onBackground,
                      padding: 0,
                    }}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword((p) => !p)}
                    activeOpacity={0.6}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={22}
                      color={AC.outline}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* ── Confirm Password Input ───────────────────── */}
              <View style={{ width: "100%", marginBottom: 8 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "500",
                    color: AC.onBackground,
                    marginBottom: 6,
                    marginLeft: 2,
                  }}
                >
                  Confirm Password
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: AC.surfaceLow,
                    borderRadius: 12,
                    height: 56,
                    paddingHorizontal: 16,
                  }}
                >
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={20}
                    color={AC.onSurfaceVariant}
                    style={{ marginRight: 12 }}
                  />
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Repeat your password"
                    placeholderTextColor={AC.outline}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    style={{
                      flex: 1,
                      fontSize: 16,
                      color: AC.onBackground,
                      padding: 0,
                    }}
                    editable={!loading}
                  />
                </View>
              </View>

              {/* ── Register Button ──────────────────────────── */}
              <TouchableOpacity
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.85}
                style={{
                  width: "100%",
                  height: 56,
                  backgroundColor: loading ? AC.outlineVariant : AC.primary,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  marginTop: 24,
                  shadowColor: "#4f46e5",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.2,
                  shadowRadius: 24,
                  elevation: 6,
                }}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text
                    style={{
                      color: AC.onPrimary,
                      fontSize: 14,
                      fontWeight: "600",
                      letterSpacing: 0.1,
                    }}
                  >
                    Register
                  </Text>
                )}
              </TouchableOpacity>

              {/* ── Login Link ───────────────────────────────── */}
              <View
                style={{
                  marginTop: 24,
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => router.push("/(auth)/login")}
                  activeOpacity={0.7}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: AC.primary,
                    }}
                  >
                    Already have an account? Log in
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
