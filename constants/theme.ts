/**
 * Central color tokens for the Poddy app.
 * These mirror the tailwind.config.js values so inline styles
 * can reference the same palette without magic strings.
 */
export const Colors = {
  bg: "#F6F6F9",
  surface: "#FFFFFF",
  surfaceHover: "#F0F0F4",
  border: "#E4E4E9",
  accent: "#0D9488",
  accentSoft: "#CCFBF1",
  textPrimary: "#1A1A2E",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",
} as const;

/** per niche accent colors used for avatars, badges, and category cards. */
export const NicheColors: Record<string, string> = {
  "Computer Science": "#0D9488",
  Biology: "#059669",
  Law: "#D97706",
  Psychology: "#E11D48",
  Chemistry: "#2563EB",
  Mathematics: "#DC2626",
  History: "#EA580C",
  Literature: "#0891B2",
  Physics: "#CA8A04",
};
