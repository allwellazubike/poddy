export function useAuth() {
  return {
    isSignedIn: true,
    isLoaded: true,
    getToken: async () => "mock-token",
  };
}
