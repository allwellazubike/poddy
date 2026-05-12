import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSignIn, useSignUp } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants";

export default function SignInScreen() {
  const { signIn, setActive: setSignInActive, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setSignUpActive, isLoaded: signUpLoaded } = useSignUp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = useCallback(async () => {
    if (!signInLoaded || !signIn) return;
    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      });

      if (result.status === "complete" && result.createdSessionId) {
        await setSignInActive({ session: result.createdSessionId });
      }
    } catch (err: any) {
      Alert.alert(
        "Sign In Failed",
        err?.errors?.[0]?.longMessage || "Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  }, [signIn, signInLoaded, email, password, setSignInActive]);

  const handleSignUp = useCallback(async () => {
    if (!signUpLoaded || !signUp) return;
    setLoading(true);
    try {
      const result = await signUp.create({
        emailAddress: email.trim(),
        password,
      });

      if (result.status === "complete" && result.createdSessionId) {
        await setSignUpActive({ session: result.createdSessionId });
      }
    } catch (err: any) {
      Alert.alert(
        "Sign Up Failed",
        err?.errors?.[0]?.longMessage || "Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [signUp, signUpLoaded, email, password, setSignUpActive]);

  const handleSubmit = isSignUp ? handleSignUp : handleSignIn;
  const isDisabled = !email.trim() || !password || loading;

  return (
    <SafeAreaView className="flex-1 bg-poddy-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-8">
          {/* Logo / Brand */}
          <View className="items-center mb-10">
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                backgroundColor: Colors.accentSoft,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Ionicons name="headset" size={32} color={Colors.accent} />
            </View>
            <Text className="text-poddy-text-primary text-[28px] font-bold tracking-tight">
              Poddy
            </Text>
            <Text className="text-poddy-text-secondary text-[14px] mt-1">
              Turn any PDF into a podcast
            </Text>
          </View>

          {/* Email field */}
          <View className="bg-poddy-surface border border-poddy-border rounded-xl px-4 py-3 mb-3">
            <Text className="text-poddy-text-muted text-[11px] font-medium mb-1">
              EMAIL
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@email.com"
              placeholderTextColor={Colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              className="text-poddy-text-primary text-[15px]"
              style={{ padding: 0 }}
            />
          </View>

          {/* Password field */}
          <View className="bg-poddy-surface border border-poddy-border rounded-xl px-4 py-3 mb-6">
            <Text className="text-poddy-text-muted text-[11px] font-medium mb-1">
              PASSWORD
            </Text>
            <View className="flex-row items-center">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                className="flex-1 text-poddy-text-primary text-[15px]"
                style={{ padding: 0 }}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((p) => !p)}
                activeOpacity={0.6}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isDisabled}
            activeOpacity={0.8}
            style={{
              backgroundColor: isDisabled ? Colors.border : Colors.accent,
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-[16px] font-bold">
                {isSignUp ? "Create Account" : "Sign In"}
              </Text>
            )}
          </TouchableOpacity>

          {/* Toggle sign-in / sign-up */}
          <TouchableOpacity
            onPress={() => setIsSignUp((p) => !p)}
            activeOpacity={0.6}
            className="items-center"
          >
            <Text className="text-poddy-text-secondary text-[13px]">
              {isSignUp
                ? "Already have an account? "
                : "Don't have an account? "}
              <Text style={{ color: Colors.accent, fontWeight: "600" }}>
                {isSignUp ? "Sign In" : "Sign Up"}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
