// Writes RSP signals to Supabase. Write-only — never read back to the client.
import { supabase } from "@/integrations/supabase/client";
import type { FAASignal } from "./types";

export async function writeSignal(signal: FAASignal): Promise<void> {
  try {
    const { error } = await supabase.from("rsp_signals" as never).insert({
      ...signal,
      expires_at: null,
    } as never);
    if (error) {
      // Silent failure — never surface RSP errors to the user
      console.error("[RSP] Signal write failed:", error.message);
    }
  } catch (e) {
    console.error("[RSP] Signal write threw:", e);
  }
}
