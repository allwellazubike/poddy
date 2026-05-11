/** Strips the `.pdf` extension from a filename for display. */
export function cleanFilename(f: string): string {
  return f.replace(/\.pdf$/i, "");
}

/** Formats a play count: 1000+ → "1.0k", otherwise the raw number. */
export function formatPlays(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
