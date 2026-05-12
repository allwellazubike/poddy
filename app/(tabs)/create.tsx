import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/utils/mock-auth";
import { router } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { Colors } from "@/constants";
import { apiFetch } from "@/utils";
import { ScreenHeader } from "@/components/ui";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function CreateScreen() {
  const { getToken } = useAuth();

  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handlePickFile = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0]) return;

      const picked = result.assets[0];

      // Validate file size
      if (picked.size && picked.size > MAX_FILE_SIZE) {
        Alert.alert(
          "File Too Large",
          "Please select a PDF under 5MB."
        );
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
      const token = await getToken();

      const formData = new FormData();
      formData.append("pdf", {
        uri: file.uri,
        name: file.name || "upload.pdf",
        type: "application/pdf",
      } as any);
      formData.append("customPrompt", customPrompt);
      formData.append("isPublic", isPublic ? "true" : "false");

      const res = await apiFetch<{ id: string }>(
        "/upload",
        token,
        {
          method: "POST",
          body: formData,
        }
      );

      // Reset form
      setFile(null);
      setCustomPrompt("");
      setIsPublic(false);

      // Navigate to player/polling screen
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
  }, [file, customPrompt, isPublic, getToken]);

  return (
    <SafeAreaView className="flex-1 bg-poddy-bg" edges={["top"]}>
      <ScreenHeader title="Create" subtitle="Generate a podcast from any PDF" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Upload area */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handlePickFile}
          disabled={submitting}
        >
          <View className="w-full rounded-2xl border-2 border-dashed border-poddy-border items-center justify-center py-16 mb-8">
            <View className="w-16 h-16 rounded-2xl bg-poddy-accent-soft items-center justify-center mb-4">
              <Ionicons
                name={file ? "document" : "cloud-upload-outline"}
                size={32}
                color={Colors.accent}
              />
            </View>
            {file ? (
              <>
                <Text
                  className="text-poddy-text-primary text-[14px] font-semibold mb-1 px-4"
                  numberOfLines={2}
                  style={{ textAlign: "center" }}
                >
                  {file.name}
                </Text>
                <Text className="text-poddy-accent text-[12px] font-medium">
                  Tap to change
                </Text>
              </>
            ) : (
              <>
                <Text className="text-poddy-text-primary text-[16px] font-semibold mb-1">
                  Tap to upload a PDF
                </Text>
                <Text className="text-poddy-text-muted text-[13px]">
                  Max file size: 5MB
                </Text>
              </>
            )}
          </View>
        </TouchableOpacity>

        {/* Custom instructions */}
        <View className="w-full bg-poddy-surface border border-poddy-border rounded-xl p-4 mb-6">
          <Text className="text-poddy-text-secondary text-[13px] mb-2">
            Custom instructions (optional)
          </Text>
          <TextInput
            value={customPrompt}
            onChangeText={setCustomPrompt}
            placeholder="e.g. Focus on inheritance and polymorphism"
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={3}
            className="text-poddy-text-primary text-[13px]"
            style={{ padding: 0, textAlignVertical: "top", minHeight: 48 }}
            editable={!submitting}
          />
        </View>

        {/* Visibility toggle */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setIsPublic((p) => !p)}
          disabled={submitting}
        >
          <View className="w-full flex-row items-center justify-between bg-poddy-surface border border-poddy-border rounded-xl px-4 py-3 mb-6">
            <View className="flex-row items-center">
              <Ionicons
                name={isPublic ? "globe" : "lock-closed-outline"}
                size={18}
                color={Colors.textSecondary}
              />
              <Text className="text-poddy-text-primary text-[14px] font-medium ml-3">
                {isPublic ? "Public" : "Private"}
              </Text>
            </View>
            {/* Toggle track */}
            <View
              style={{
                width: 40,
                height: 24,
                borderRadius: 12,
                backgroundColor: isPublic ? Colors.accent : Colors.border,
                justifyContent: "center",
                paddingHorizontal: 2,
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: "#fff",
                  alignSelf: isPublic ? "flex-end" : "flex-start",
                }}
              />
            </View>
          </View>
        </TouchableOpacity>

        {/* Generate button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!file || submitting}
          activeOpacity={0.8}
          style={{
            backgroundColor: !file || submitting ? Colors.border : Colors.accent,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: "center",
          }}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-[16px] font-bold">
              Generate Podcast
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
