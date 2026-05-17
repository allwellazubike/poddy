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
  StyleSheet,
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
    <SafeAreaView style={s.screen} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Page header */}
          <View style={s.pageHeader}>
            <Text style={s.pageTitle}>New podcast</Text>
            <Text style={s.pageSub}>Upload a PDF to get started</Text>
          </View>

          {/* ── 1. Document ── */}
          <Text style={s.sectionLabel}>1. Document</Text>
          <Pressable
            onPress={handlePickFile}
            disabled={submitting}
            style={({ pressed }) => [
              s.uploadZone,
              file && s.uploadZoneActive,
              pressed && s.pressed,
            ]}
          >
            <Ionicons
              name={file ? "document-text" : "document-attach-outline"}
              size={28}
              color={file ? "#1A1A1A" : "#AAAAAA"}
            />
            {file ? (
              <View style={{ flex: 1 }}>
                <Text style={s.fileName} numberOfLines={1}>
                  {file.name}
                </Text>
                <Text style={s.fileSub}>Tap to change</Text>
              </View>
            ) : (
              <View style={{ flex: 1 }}>
                <Text style={s.uploadLabel}>Choose PDF</Text>
                <Text style={s.uploadSub}>Max 5 MB</Text>
              </View>
            )}
            {file && (
              <Pressable
                onPress={() => setFile(null)}
                hitSlop={8}
                style={s.clearBtn}
              >
                <Ionicons name="close" size={16} color="#888888" />
              </Pressable>
            )}
          </Pressable>

          {/* ── 2. Instructions ── */}
          <Text style={s.sectionLabel}>2. Instructions (optional)</Text>
          <View style={s.textareaWrap}>
            <TextInput
              style={s.textarea}
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
          <Text style={s.sectionLabel}>3. Settings</Text>

          {/* Public toggle */}
          <Pressable
            onPress={() => setIsPublic((p) => !p)}
            disabled={submitting}
            style={({ pressed }) => [s.toggleRow, pressed && s.pressed]}
          >
            <View style={s.toggleLeft}>
              <Ionicons
                name={isPublic ? "globe-outline" : "lock-closed-outline"}
                size={18}
                color="#888888"
              />
              <View style={{ marginLeft: 12 }}>
                <Text style={s.toggleLabel}>
                  {isPublic ? "Public" : "Private"}
                </Text>
                <Text style={s.toggleSub}>
                  {isPublic
                    ? "Anyone can discover this podcast"
                    : "Only visible to you"}
                </Text>
              </View>
            </View>
            {/* Toggle pill */}
            <View style={[s.pill, isPublic && s.pillActive]}>
              <View style={[s.pillThumb, isPublic && s.pillThumbActive]} />
            </View>
          </Pressable>

          {/* Category (only when public) */}
          {isPublic && (
            <View style={s.categoryWrap}>
              <Text style={s.categoryLabel}>Category</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={s.categoryRow}
              >
                {CATEGORIES.map((cat) => {
                  const active = category === cat.name;
                  return (
                    <Pressable
                      key={cat.name}
                      onPress={() => setCategory(cat.name)}
                      style={[s.chip, active && s.chipActive]}
                    >
                      <Text style={[s.chipText, active && s.chipTextActive]}>
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
        <View style={s.footer}>
          <Pressable
            onPress={handleSubmit}
            disabled={!file || submitting}
            style={({ pressed }) => [
              s.generateBtn,
              (!file || submitting) && s.generateBtnDisabled,
              pressed && s.pressed,
            ]}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={s.generateBtnText}>Generate podcast</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F5F5" },
  scroll: { paddingHorizontal: 20, paddingBottom: 24 },

  pageHeader: { paddingTop: 20, marginBottom: 28 },
  pageTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    color: "#111111",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  pageSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#888888",
  },

  sectionLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: "#111111",
    marginBottom: 10,
    marginTop: 24,
  },

  // Upload zone
  uploadZone: {
    flexDirection: "row",
    alignItems: "center",
    height: 72,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
    paddingHorizontal: 16,
    gap: 14,
  },
  uploadZoneActive: {
    borderStyle: "solid",
    borderColor: "#1A1A1A",
  },
  uploadLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: "#111111",
    marginBottom: 2,
  },
  uploadSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#888888",
  },
  fileName: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: "#111111",
    marginBottom: 2,
  },
  fileSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#888888",
  },
  clearBtn: {
    padding: 4,
  },

  // Textarea
  textareaWrap: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: 14,
    minHeight: 96,
  },
  textarea: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#111111",
    minHeight: 72,
    lineHeight: 20,
  },

  // Toggle
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  toggleLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  toggleLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: "#111111",
    marginBottom: 2,
  },
  toggleSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#888888",
  },
  pill: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#E0E0E0",
    padding: 3,
    justifyContent: "center",
  },
  pillActive: { backgroundColor: "#1A1A1A" },
  pillThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignSelf: "flex-start",
  },
  pillThumbActive: { alignSelf: "flex-end" },

  // Category
  categoryWrap: { marginTop: 16 },
  categoryLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: "#888888",
    marginBottom: 10,
  },
  categoryRow: { gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  chipActive: {
    backgroundColor: "#1A1A1A",
    borderColor: "#1A1A1A",
  },
  chipText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: "#111111",
  },
  chipTextActive: { color: "#FFFFFF" },

  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#F5F5F5",
  },
  generateBtn: {
    height: 52,
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  generateBtnDisabled: { backgroundColor: "#CCCCCC" },
  generateBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: "#FFFFFF",
  },

  pressed: { opacity: 0.75 },
});
