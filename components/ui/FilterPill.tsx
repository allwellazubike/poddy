import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Colors } from "@/constants";

interface FilterPillProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

/**
 * A pill-shaped filter button, used in the Library screen
 * and potentially anywhere filter chips are needed.
 */
export function FilterPill({ label, active = false, onPress }: FilterPillProps) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <View
        className="mr-2 rounded-lg border border-poddy-border px-4 py-1.5"
        style={
          active
            ? { backgroundColor: Colors.accent, borderColor: Colors.accent }
            : {}
        }
      >
        <Text
          className="text-[13px] font-medium"
          style={{ color: active ? "#fff" : Colors.textSecondary }}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
