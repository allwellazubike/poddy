/**
 * Poddy — Utility First Design System
 * Light theme. 6 colors. No exceptions.
 */
export const Colors = {
  bg: "#F5F5F5",        // warm off-white — screen backgrounds
  card: "#FFFFFF",       // all surfaces, inputs, cards
  border: "#E0E0E0",     // dividers, card outlines
  text: "#111111",       // primary text
  muted: "#888888",      // labels, timestamps, placeholders
  accent: "#1A1A1A",     // buttons, active states, icons

  // aliases for backward compat with components referencing old names
  textPrimary: "#111111",
  textSecondary: "#888888",
  textMuted: "#AAAAAA",
  surface: "#FFFFFF",
  surfaceHover: "#F0F0F0",
  surfaceLow: "#F5F5F5",
  accentSoft: "#EFEFEF",
} as const;

export const NicheColors: Record<string, string> = {
  "Computer Science": "#1A1A1A",
  "Biology": "#1A1A1A",
  "Law": "#1A1A1A",
  "Psychology": "#1A1A1A",
  "Chemistry": "#1A1A1A",
  "Mathematics": "#1A1A1A",
  "History": "#1A1A1A",
  "Literature": "#1A1A1A",
  "Physics": "#1A1A1A",
  "General": "#1A1A1A",
};
