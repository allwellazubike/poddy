import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { tokenCache } from "@/utils/token-cache";
import "./global.css";

const CLERK_PUBLISHABLE_KEY =
  "pk_test_ZmFjdHVhbC1oYWRkb2NrLTU3LmNsZXJrLmFjY291bnRzLmRldiQ";

/**
 * Redirects unauthenticated users to /sign-in and
 * authenticated users away from /sign-in back to the tabs.
 */
function AuthGate() {
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuth = segments[0] === "sign-in";

    if (!isSignedIn && !inAuth) {
      router.replace("/sign-in");
    } else if (isSignedIn && inAuth) {
      router.replace("/(tabs)");
    }
  }, [isSignedIn, isLoaded, segments]);

  return null;
}

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <ClerkLoaded>
        <StatusBar style="dark" />
        <AuthGate />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#F6F6F9" },
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="sign-in" />
          <Stack.Screen name="player/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
