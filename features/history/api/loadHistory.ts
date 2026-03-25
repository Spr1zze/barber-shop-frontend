import Constants from "expo-constants";
import { Platform } from "react-native";
import type { History } from "../data/historyData";

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, "");
}

function getExpoHost() {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.expoGoConfig?.debuggerHost ??
    null;

  if (!hostUri) return null;

  return hostUri.replace(/^https?:\/\//, "").split(":")[0] ?? null;
}

function getApiBaseUrl() {
  const configuredUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  if (configuredUrl) {
    return normalizeBaseUrl(configuredUrl);
  }

  const expoHost = getExpoHost();

  if (expoHost) {
    return `http://${expoHost}:8000`;
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:8000";
  }

  return "http://localhost:8000";
}

const API_BASE_URL = getApiBaseUrl();

export async function loadHistory(): Promise<History[]> {
  const res = await fetch(`${API_BASE_URL}/appointments/history`);

  if (!res.ok) {
    throw new Error("Failed to load history");
  }

  return res.json();
}
