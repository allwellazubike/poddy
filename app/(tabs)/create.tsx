import { CATEGORIES, Colors } from "@/constants";
import { apiFetch } from "@/utils";

import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  Pressable,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function CreateScreen() {
  const params = useLocalSearchParams<{ category?: string }>();
  const initialCategory = params.category
    ? decodeURIComponent(params.category)
    : "General";

  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [category, setCategory] = useState(initialCategory);
  const [submitting, setSubmitting] = useState(false);

  const handlePickFile = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0]) return;
      const picked = result.assets[0];

      if (picked.size && picked.size > MAX_FILE_SIZE) {
        Alert.alert("File Too Large", "Please select a PDF under 5MB.");
        return;
      }
      setFile(picked);
    } catch (err) {
      console.error("File pick error:", err);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!file) {
      Alert.alert("No File", "Please select a PDF first.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("pdf", {
        uri: file.uri,
        name: file.name || "upload.pdf",
        type: "application/pdf",
      } as any);
      formData.append("customPrompt", customPrompt);
      formData.append("isPublic", isPublic ? "true" : "false");
      formData.append("category", isPublic ? category : "");

      const res = await apiFetch<{ id: string }>("/podcasts/upload", {
        method: "POST",
        body: formData,
      });

      setFile(null);
      setCustomPrompt("");
      setIsPublic(false);

      router.push({
        // @ts-ignore
        pathname: "/player/[id]",
        params: { id: res.id },
      });
    } catch (err: any) {
      Alert.alert("Upload Failed", err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }, [file, customPrompt, isPublic, category]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }} edges={["top"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 80 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={{ marginBottom: 40 }}>
            <Text
              style={{
                fontFamily: "Inter_800ExtraBold",
                fontSize: 40,
                color: Colors.textPrimary,
                letterSpacing: -1,
                marginBottom: 8,
              }}
            >
              New Project
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 16,
                color: Colors.textSecondary,
              }}
            >
              Transform your document into a podcast.
            </Text>
          </View>

          {/* File Picker */}
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
              Document
            </Text>
            <Pressable
              onPress={handlePickFile}
              disabled={submitting}
              style={({ pressed }) => ({
                width: "100%",
                padding: 24,
                borderWidth: 1,
                borderColor: file ? Colors.textPrimary : Colors.border,
                borderStyle: file ? "solid" : "dashed",
                alignItems: "center",
                justifyContent: "center",
                opacity: pressed ? 0.6 : 1,
              })}
            >
              <Ionicons
                name={file ? "document-text" : "document-attach-outline"}
                size={32}
                color={file ? Colors.textPrimary : Colors.textSecondary}
                style={{ marginBottom: 12 }}
              />
              {file ? (
                <>
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 14,
                      color: Colors.textPrimary,
                      textAlign: "center",
                      marginBottom: 4,
                    }}
                    numberOfLines={1}
                  >
                    {file.name}
                  </Text>
                  <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textSecondary }}>
                    Tap to change
                  </Text>
                </>
              ) : (
                <>
                  <Text style={{ fontFamily: "Inter_500Medium", fontSize: 14, color: Colors.textPrimary, marginBottom: 4 }}>
                    Select a PDF
                  </Text>
                  <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textSecondary }}>
                    Max size: 5MB
                  </Text>
                </>
              )}
            </Pressable>
          </View>

          {/* Custom Prompt */}
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
              Custom Instructions
            </Text>
            <TextInput
              value={customPrompt}
              onChangeText={setCustomPrompt}
              placeholder="e.g. Focus on chapter 3, keep it casual..."
              placeholderTextColor={Colors.textMuted}
              multiline
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 16,
                color: Colors.textPrimary,
                borderBottomWidth: 1,
                borderBottomColor: Colors.border,
                paddingVertical: 12,
                minHeight: 48,
              }}
              editable={!submitting}
            />
          </View>

          {/* Visibility Toggle */}
          <View style={{ marginBottom: 32 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 12,
                  color: Colors.textSecondary,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Visibility
              </Text>
              <Pressable
                onPress={() => setIsPublic(!isPublic)}
                disabled={submitting}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.textPrimary }}>
                  {isPublic ? "Public" : "Private"}
                </Text>
                <Ionicons name={isPublic ? "globe-outline" : "lock-closed-outline"} size={16} color={Colors.textPrimary} />
              </Pressable>
            </View>

            {/* Category selection if public */}
            {isPublic && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat.name;
                  return (
                    <Pressable
                      key={cat.name}
                      onPress={() => setCategory(cat.name)}
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderWidth: 1,
                        borderColor: isSelected ? Colors.textPrimary : Colors.border,
                        backgroundColor: isSelected ? Colors.textPrimary : "transparent",
                        borderRadius: 20,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Inter_500Medium",
                          fontSize: 13,
                          color: isSelected ? Colors.bg : Colors.textPrimary,
                        }}
                      >
                        {cat.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}
          </View>

          {/* Submit Button */}
          <Pressable
            onPress={handleSubmit}
            disabled={!file || submitting}
            style={({ pressed }) => ({
              width: "100%",
              height: 56,
              backgroundColor: !file || submitting ? Colors.border : Colors.textPrimary,
              borderRadius: 4,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row" as const,
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
              marginTop: 16,
            })}
          >
            {submitting ? (
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
                Generate
              </Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
