import { API_BASE_URL } from "@/features/salons/lib/GetApiBaseURL";

import type { History } from "../data/historyData";

export async function loadHistory(): Promise<History[]> {
  const res = await fetch(`${API_BASE_URL}/appointments/history`);

  if (!res.ok) {
    throw new Error("Kunne ikke hente bookinghistorik.");
  }

  return res.json();
}
