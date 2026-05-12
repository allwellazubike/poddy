import { API_BASE } from "@/constants";

/**
 * Authenticated fetch wrapper for the Poddy backend.
 * Automatically attaches the Clerk JWT as a Bearer token.
 *
 * @param path   Route path appended to API_BASE (e.g. "/feed", "/upload")
 * @param token  Clerk session token from useAuth().getToken()
 * @param options Additional fetch options (method, body, headers, etc.)
 */
export async function apiFetch<T = any>(
  path: string,
  token: string | null,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

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
