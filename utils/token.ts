import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "poddy_auth_token";

/**
 * Persist the JWT token to the device's secure storage.
 */
export async function setToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

/**
 * Retrieve the JWT token from secure storage.
 * Returns null if no token is stored.
 */
export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

/**
 * Remove the JWT token from secure storage (logout).
 */
export async function removeToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
