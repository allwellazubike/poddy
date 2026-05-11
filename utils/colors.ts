import { NicheColors } from "@/constants";

/** Returns the accent color for a given niche, falling back to grey. */
export function getNicheColor(niche: string): string {
  return NicheColors[niche] || "#6B7280";
}
