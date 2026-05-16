/**
 * Central color tokens for the Poddy app.
 * Design system: Graphite & Ivory (Minimalist Editorial).
 * Strict monochrome, pure contrast.
 */
export const Colors = {
  bg: "#000000",
  surface: "#121212",
  surfaceHover: "#18181B",
  surfaceLow: "#09090B",
  border: "#27272A",
  borderLight: "#18181B",
  
  // Accents are basically high contrast text or white
  accent: "#FFFFFF",
  accentSoft: "#27272A", 
  
  textPrimary: "#FFFFFF",
  textSecondary: "#A1A1AA",
  textMuted: "#52525B",
} as const;

/** 
 * Niche colors for Explore/Badges.
 * In a mature minimal app, these should be muted or strictly gray.
 * Let's use subtle, muted tones that look professional against black.
 */
export const NicheColors: Record<string, string> = {
  "Computer Science": "#3F3F46",
  Biology: "#3F3F46",
  Law: "#3F3F46",
  Psychology: "#3F3F46",
  Chemistry: "#3F3F46",
  Mathematics: "#3F3F46",
  History: "#3F3F46",
  Literature: "#3F3F46",
  Physics: "#3F3F46",
  General: "#3F3F46",
};
