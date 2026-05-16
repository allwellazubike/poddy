import { API_BASE } from "@/constants";
import { getToken } from "./token";

/**
 * Fetch wrapper for the Poddy backend.
 * Automatically injects the JWT from secure storage into the
 * Authorization header for every request.
 *
 * @param path   Route path appended to API_BASE (e.g. "/podcasts/feed", "/auth/login")
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

  // Inject JWT if available
  const token = await getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
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
