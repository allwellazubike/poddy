import { API_BASE } from "@/constants";

/**
 * Fetch wrapper for the Poddy backend.
 * Currently uses mockAuth on the backend, so no token is needed.
 * When JWT auth is implemented, you can add a token parameter back here.
 *
 * @param path   Route path appended to API_BASE (e.g. "/feed", "/upload")
 * @param options Additional fetch options (method, body, headers, etc.)
 */
export async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Don't set Content-Type for FormData — the browser/RN sets it with the boundary
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}
