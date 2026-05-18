import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { router, useLocalSearchParams } from "expo-router";
import { CATEGORIES } from "@/constants";
import { apiFetch } from "@/utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

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
        Alert.alert("File too large", "Please choose a PDF under 5 MB.");
        return;
      }
      setFile(picked);
    } catch (err) {
      console.error("File pick error:", err);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!file) {
      Alert.alert("No file selected", "Please choose a PDF first.");
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
      Alert.alert("Upload failed", err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }, [file, customPrompt, isPublic, category]);

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F5]" edges={["top"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Page header */}
          <View className="pt-5 mb-7">
            <Text className="font-bold text-[22px] text-gray-900 tracking-tight mb-1">
              New podcast
            </Text>
            <Text className="font-normal text-[14px] text-gray-500">
              Upload a PDF to get started
            </Text>
          </View>

          {/* ── 1. Document ── */}
          <Text className="font-semibold text-[13px] text-gray-900 mb-2.5 mt-6">
            1. Document
          </Text>
          <Pressable
            onPress={handlePickFile}
            disabled={submitting}
            className={`flex-row items-center h-[72px] bg-white rounded-[10px] border-[1.5px] px-4 active:opacity-75 ${
              file ? "border-solid border-gray-900" : "border-dashed border-gray-300"
            }`}
          >
            <Ionicons
              name={file ? "document-text" : "document-attach-outline"}
              size={28}
              color={file ? "#111111" : "#AAAAAA"}
              style={{ marginRight: 14 }}
            />
            {file ? (
              <View className="flex-1">
                <Text className="font-medium text-[14px] text-gray-900 mb-0.5" numberOfLines={1}>
                  {file.name}
                </Text>
                <Text className="font-normal text-[12px] text-gray-500">Tap to change</Text>
              </View>
            ) : (
              <View className="flex-1">
                <Text className="font-medium text-[14px] text-gray-900 mb-0.5">Choose PDF</Text>
                <Text className="font-normal text-[12px] text-gray-500">Max 5 MB</Text>
              </View>
            )}
            {file && (
              <Pressable onPress={() => setFile(null)} hitSlop={8} className="p-1">
                <Ionicons name="close" size={16} color="#888888" />
              </Pressable>
            )}
          </Pressable>

          {/* ── 2. Instructions ── */}
          <Text className="font-semibold text-[13px] text-gray-900 mb-2.5 mt-6">
            2. Instructions (optional)
          </Text>
          <View className="bg-white rounded-[10px] border border-gray-200 p-3.5 min-h-[96px]">
            <TextInput
              className="font-normal text-[14px] text-gray-900 min-h-[72px] leading-5"
              value={customPrompt}
              onChangeText={setCustomPrompt}
              placeholder="e.g. Focus on chapter 3, keep it casual, use simple language…"
              placeholderTextColor="#AAAAAA"
              multiline
              textAlignVertical="top"
              editable={!submitting}
            />
          </View>

          {/* ── 3. Settings ── */}
          <Text className="font-semibold text-[13px] text-gray-900 mb-2.5 mt-6">
            3. Settings
          </Text>

          {/* Public toggle */}
          <Pressable
            onPress={() => setIsPublic((p) => !p)}
            disabled={submitting}
            className="flex-row items-center justify-between bg-white rounded-[10px] border border-gray-200 px-4 py-3.5 active:opacity-75"
          >
            <View className="flex-row items-center flex-1">
              <Ionicons
                name={isPublic ? "globe-outline" : "lock-closed-outline"}
                size={18}
                color="#888888"
              />
              <View className="ml-3">
                <Text className="font-medium text-[14px] text-gray-900 mb-0.5">
                  {isPublic ? "Public" : "Private"}
                </Text>
                <Text className="font-normal text-[12px] text-gray-500">
                  {isPublic ? "Anyone can discover this podcast" : "Only visible to you"}
                </Text>
              </View>
            </View>
            {/* Toggle pill */}
            <View className={`w-11 h-6 rounded-full p-0.5 justify-center ${isPublic ? "bg-gray-900" : "bg-gray-300"}`}>
              <View className={`w-5 h-5 rounded-full bg-white ${isPublic ? "self-end" : "self-start"}`} />
            </View>
          </Pressable>

          {/* Category (only when public) */}
          {isPublic && (
            <View className="mt-4">
              <Text className="font-medium text-[13px] text-gray-500 mb-2.5">
                Select a category for your public podcast:
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {CATEGORIES.map((cat) => {
                  const active = category === cat.name;
                  return (
                    <Pressable
                      key={cat.name}
                      onPress={() => setCategory(cat.name)}
                      className={`flex-row items-center px-3.5 py-2 rounded-full border ${
                        active ? "bg-gray-900 border-gray-900" : "bg-white border-gray-200"
                      }`}
                    >
                      <Ionicons
                        name={cat.icon as any}
                        size={14}
                        color={active ? "#FFFFFF" : "#888888"}
                        style={{ marginRight: 6 }}
                      />
                      <Text className={`font-medium text-[13px] ${active ? "text-white" : "text-gray-900"}`}>
                        {cat.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </ScrollView>

        {/* ── Sticky Generate button ── */}
        <View className="px-5 py-3 border-t border-gray-200 bg-[#F5F5F5]">
          <Pressable
            onPress={handleSubmit}
            disabled={!file || submitting}
            className={`h-[52px] rounded-lg items-center justify-center active:opacity-75 ${
              !file || submitting ? "bg-gray-300" : "bg-gray-900"
            }`}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text className="font-semibold text-[15px] text-white">Generate podcast</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
