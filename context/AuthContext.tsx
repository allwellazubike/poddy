import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiFetch } from "@/utils/api";
import { getToken, setToken, removeToken } from "@/utils/token";

// ─── Types ────────────────────────────────────────────────────────────

interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextValue {
  /** Whether the auth state has been loaded from storage */
  isLoaded: boolean;
  /** Whether the user is currently signed in */
  isSignedIn: boolean;
  /** The signed-in user's UUID (or null) */
  userId: string | null;
  /** The signed-in user object (or null) */
  user: AuthUser | null;
  /** Retrieve the current JWT from secure storage */
  getToken: () => Promise<string | null>;
  /**
   * Register a new account.
   * On success, persists the token and sets the user state.
   */
  register: (email: string, password: string) => Promise<void>;
  /**
   * Log in with email and password.
   * On success, persists the token and sets the user state.
   */
  login: (email: string, password: string) => Promise<void>;
  /** Log out — clears the token and resets state. */
  logout: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  // On mount, check if we already have a token stored
  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          // Decode the JWT payload to get userId
          // (we just need the middle base64 segment)
          const payload = JSON.parse(atob(token.split(".")[1]));
          if (payload.userId) {
            setUser({ id: payload.userId, email: payload.email || "" });
          }
        }
      } catch (err) {
        // Token was corrupted or expired — wipe it
        console.warn("Failed to restore auth session:", err);
        await removeToken();
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const data = await apiFetch<{ token: string; user: AuthUser }>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      },
    );

    await setToken(data.token);
    setUser(data.user);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiFetch<{ token: string; user: AuthUser }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      },
    );

    await setToken(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    await removeToken();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoaded,
      isSignedIn: !!user,
      userId: user?.id ?? null,
      user,
      getToken,
      register,
      login,
      logout,
    }),
    [isLoaded, user, register, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────

/**
 * Drop-in replacement for Clerk's useAuth().
 *
 * Usage:
 * ```ts
 * const { getToken, userId, isSignedIn } = useAuth();
 * ```
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth() must be used within an <AuthProvider>.");
  }
  return ctx;
}
